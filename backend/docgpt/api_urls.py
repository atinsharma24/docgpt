from django.http import JsonResponse
from django.urls import path
from .views import DocumentUploadView, AskDocumentView, TestView

def api_root(request):
    return JsonResponse({
        "endpoints": {
            "upload": "/api/upload/",
            "ask": "/api/ask/",
            "test": "/api/test/"
        }
    })

urlpatterns = [
    path('', api_root),
    path('upload/', DocumentUploadView.as_view(), name='upload-document'),
    path('ask/', AskDocumentView.as_view(), name='ask-document'),
    path('test/', TestView.as_view(), name='test'),
]
