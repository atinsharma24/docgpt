from rest_framework import viewsets
from .models import Document
from .serializers import DocumentSerializer
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
# from .models import Document
from PyPDF2 import PdfReader
import openai
import os
from rest_framework.views import APIView
from rest_framework.response import Response

class TestView(APIView):
    def get(self, request):
        return Response({"message": "Hello from DocGPT!"})


openai.api_key = settings.OPENAI_API_KEY

class AskDocumentView(APIView):
    def post(self, request):
        doc_id = request.data.get("document_id")
        question = request.data.get("question")

        try:
            document = Document.objects.get(id=doc_id)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

        # Read the PDF content
        file_path = document.file.path
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

        # Send to OpenAI
        prompt = f"Answer the following question based on the document:\n\nDocument:\n{text}\n\nQuestion: {question}"
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        answer = response['choices'][0]['message']['content']
        return Response({"answer": answer})

def ping(request):
    return JsonResponse({"message": "DocGPT backend is running!"})


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

from django.http import JsonResponse

def test_view(request):
    return JsonResponse({"message": "DocGPT is alive!"})


class DocumentUploadView(APIView):
    def post(self, request, *args, **kwargs):
        # handle file upload here
        return Response({"message": "File uploaded successfully"}, status=status.HTTP_200_OK)
