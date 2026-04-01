from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CreateSignedURLViewSet, ProcessCMUrlView, EndpointViewSet, MLAlgorithmViewSet, MLAlgorithmStatusViewSet, MLRequestViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"endpoints", EndpointViewSet, basename="endpoints")
router.register(r"mlalgorithms", MLAlgorithmViewSet, basename="mlalgorithms")
router.register(r"mlalgorithmstatuses", MLAlgorithmStatusViewSet, basename="mlalgorithmstatuses")
router.register(r"mlrequests", MLRequestViewSet, basename="mlrequests")

urlpatterns = router.urls + [
    path("createsignedurls/", CreateSignedURLViewSet.as_view(), name="createsignedurls"),
    path("uploadcmurl/", ProcessCMUrlView.as_view(), name="uploadcmurl"),
    
]
