from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet
from django.urls import path
from .views import ping

router = DefaultRouter()
router.register(r'documents', DocumentViewSet)

urlpatterns = router.urls

urlpatterns = [
    path('ping/', ping),
]
