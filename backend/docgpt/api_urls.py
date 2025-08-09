from django.urls import path
from .views import DocumentUploadView, AskDocumentView, TestView

urlpatterns = [
    path('upload/', DocumentUploadView.as_view(), name='upload-document'),
    path('ask/', AskDocumentView.as_view(), name='ask-document'),
    path('test/', TestView.as_view(), name='test'),
]
