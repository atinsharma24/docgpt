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


# Initialize OpenAI client (only if API key is available)
client = None
if hasattr(settings, 'OPENAI_API_KEY') and settings.OPENAI_API_KEY:
    client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

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
        if not client:
            return Response({"error": "OpenAI API key not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        try:
            prompt = f"Answer the following question based on the document:\n\nDocument:\n{text}\n\nQuestion: {question}"
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0
            )
            answer = response.choices[0].message.content
            return Response({"answer": answer})
        except Exception as e:
            return Response({"error": f"OpenAI API error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        if 'document' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        file = request.FILES['document']
        
        # Create document instance
        document = Document.objects.create(
            title=file.name,
            file=file
        )
        
        serializer = DocumentSerializer(document)
        return Response({
            "message": "File uploaded successfully",
            "document": serializer.data
        }, status=status.HTTP_201_CREATED)
