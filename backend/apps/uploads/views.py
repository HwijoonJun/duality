from rest_framework import viewsets
from rest_framework import mixins
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework.views import APIView

from django.db import transaction

from .serializers import EndpointSerializer, MLAlgorithmSerializer, MLAlgorithmStatusSerializer, MLRequestSerializer, CreateSignedURLSerializer, ProcessCMUrlSerializer
from .models import Endpoint, MLAlgorithm, MLAlgorithmStatus, MLRequest


class CreateSignedURLViewSet(APIView):
    serializer_class = CreateSignedURLSerializer

    def post(self, request):
        files = request.data.get("files")

        if not isinstance(files, list) or len(files) == 0:
            raise APIException("files must be a non-empty list")

        signed_urls = CreateSignedURLSerializer.create_signed_url(files) 
        
        return Response(
            {
                "signed_urls": signed_urls,
                "message": "Signed URLs generated successfully."
            },
            status=status.HTTP_201_CREATED,
        )


class ProcessCMUrlView(APIView):
    serializer_class = ProcessCMUrlSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        response = ProcessCMUrlSerializer.process_cm_signed_url(serializer.validated_data["CM_url"])

        return Response(
            {
                "response": response,
                "message": "Crowdmark URL processed successfully."
            },
            status=status.HTTP_200_OK,
        )



class EndpointViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    serializer_class = EndpointSerializer
    queryset = Endpoint.objects.all()




class MLAlgorithmViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    serializer_class = MLAlgorithmSerializer
    queryset = MLAlgorithm.objects.all()


def deactivate_other_statuses(instance):
    old_statuses = MLAlgorithmStatus.objects.filter(parent_mlalgorithm = instance.parent_mlalgorithm,
                                                        created_at__lt=instance.created_at,
                                                        active=True)
    for i in range(len(old_statuses)):
        old_statuses[i].active = False
    MLAlgorithmStatus.objects.bulk_update(old_statuses, ["active"])

class MLAlgorithmStatusViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet,
    mixins.CreateModelMixin
):
    serializer_class = MLAlgorithmStatusSerializer
    queryset = MLAlgorithmStatus.objects.all()
    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                instance = serializer.save(active=True)
                # set active=False for other statuses
                deactivate_other_statuses(instance)



        except Exception as e:
            raise APIException(str(e))

class MLRequestViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet,
    mixins.UpdateModelMixin
):
    serializer_class = MLRequestSerializer
    queryset = MLRequest.objects.all()
