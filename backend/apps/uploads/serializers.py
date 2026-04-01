from rest_framework import serializers

import asyncio
import tempfile

from .models import ContentUpload, Endpoint, MLAlgorithm, MLAlgorithmStatus, MLRequest
from apps.services.crowdmark_processor import CrowdmarkProcessor

# supabase credentials
from supabase import create_client, Client
from config.settings import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_MEDIA_BUCKET

from rest_framework.exceptions import APIException

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

class CreateSignedURLSerializer(serializers.ModelSerializer):
    '''
    The CreateSignedURLSerializer is used to create signed URLs for file upload.
    '''
    class Meta:
        fields = ["files", "userID"]

    @staticmethod
    def create_signed_url(files):

        # Generate mutable signed URLs for file upload (valid for 1 hour)
        try:
            signed_urls = []
            for file in files:
                signed_url = supabase.storage.from_(SUPABASE_MEDIA_BUCKET).create_signed_upload_url(file)
                signed_urls.append(signed_url)
            
            if not signed_urls:
                raise APIException("Failed to generate signed URLs.")
            return signed_urls
        except Exception as e:
            raise APIException(f"Supabase error: {str(e)}")
        

    def create_signed_upload_url(file_path):
        # Generate signed upload URLs for file upload (valid for 1 hour)
        try:

            with open(file_path, "rb") as f:
                response = (
                    supabase.storage
                    .from_("content")
                    .create_signed_upload_url(file_path)
                )
            if not response:
                raise APIException("Failed to generate signed URLs.")
            print(response.path)
            return response
        except Exception as e:
            raise APIException(f"Supabase error: {str(e)}")


class ProcessCMUrlSerializer(serializers.Serializer):
    CM_url = serializers.URLField(required=True)
    
    @staticmethod
    def process_cm_signed_url(cm_url: str):
        # Process Crowdmark URL and return JSON-serializable output.
        try:
            print("1")
            result = asyncio.run(CrowdmarkProcessor(cm_url, tempfile.gettempdir()).main(sign=True))
            print("2")
            print(result)
            if isinstance(result, list):
                return {"uploads": result[0],
                        "public_urls": result[1],
                        }
            return str(result)
        except Exception as e:
            raise APIException(f"Crowdmark processing error: {str(e)}")

    @staticmethod
    def process_cm_url(cm_url: str):
        # Process Crowdmark URL and return JSON-serializable output.
        try:
            result = asyncio.run(CrowdmarkProcessor(cm_url, tempfile.gettempdir()).main(sign=False))
            if isinstance(result, (dict, list, str, int, float, bool)) or result is None:
                #result = ProcessCMUrlSerializer.get_img_public_urls(result)
                return {"uploads": result[0],
                        "public_urls": result[1],
                        }
                
            return str(result)
        except Exception as e:
            raise APIException(f"Crowdmark processing error: {str(e)}")



class ContentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentUpload
        fields = "__all__"






class EndpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endpoint
        read_only_fields = ("id", "name", "owner", "created_at")
        fields = read_only_fields


class MLAlgorithmSerializer(serializers.ModelSerializer):

    current_status = serializers.SerializerMethodField(read_only=True)

    def get_current_status(self, mlalgorithm):
        return MLAlgorithmStatus.objects.filter(parent_mlalgorithm=mlalgorithm).latest('created_at').status

    class Meta:
        model = MLAlgorithm
        read_only_fields = ("id", "name", "description", "code",
                            "version", "owner", "created_at",
                            "parent_endpoint", "current_status")
        fields = read_only_fields

class MLAlgorithmStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLAlgorithmStatus
        read_only_fields = ("id", "active")
        fields = ("id", "active", "status", "created_by", "created_at",
                            "parent_mlalgorithm")

class MLRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLRequest
        read_only_fields = (
            "id",
            "input_data",
            "full_response",
            "response",
            "created_at",
            "parent_mlalgorithm",
        )
        fields =  (
            "id",
            "input_data",
            "full_response",
            "response",
            "feedback",
            "created_at",
            "parent_mlalgorithm",
        )
