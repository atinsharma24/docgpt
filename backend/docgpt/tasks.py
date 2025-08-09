from celery import shared_task

@shared_task
def process_document(doc_id):
    # Extract text, store embeddings
    pass
