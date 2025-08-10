from django.http import JsonResponse
from django.urls import path
from .views import (
    DocumentUploadView, AskDocumentView, TestView, DocumentViewSet,
    DocumentStatsView, DocumentDeleteView
)
from rest_framework.routers import DefaultRouter

def api_root(request):
    return JsonResponse({
        "endpoints": {
            "upload": "/api/upload/",
            "ask": "/api/ask/",
            "test": "/api/test/",
            "documents": "/api/documents/",
            "stats": "/api/stats/",
            "delete": "/api/delete/<document_id>/"
        },
        "features": {
            "semantic_search": True,
            "vector_store": True,
            "document_chunking": True,
            "ai_powered_qa": True
        }
    })

router = DefaultRouter()
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', api_root),
    path('upload/', DocumentUploadView.as_view(), name='upload-document'),
    path('ask/', AskDocumentView.as_view(), name='ask-document'),
    path('test/', TestView.as_view(), name='test'),
    path('stats/', DocumentStatsView.as_view(), name='document-stats'),
    path('stats/<int:document_id>/', DocumentStatsView.as_view(), name='document-stats-detail'),
    path('delete/<int:document_id>/', DocumentDeleteView.as_view(), name='delete-document'),
] + router.urls
