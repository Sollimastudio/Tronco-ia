from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Tronco-ia API")


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


class FileWriteRequest(BaseModel):
    filename: str
    content: str


class FileWriteResponse(BaseModel):
    status: str
    filename: str


@app.get("/")
async def root():
    return {"message": "Tronco-ia API is running"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint para chat com o assistente.
    """
    return ChatResponse(response=f"Echo: {request.message}")


@app.post("/ingest/file")
async def ingest_file(file: UploadFile = File(...)):
    """
    Endpoint para ingerir um arquivo (PDF, TXT, MD).
    """
    content = await file.read()
    return {
        "status": "success",
        "filename": file.filename,
        "size": len(content),
        "message": "File ingested successfully"
    }


@app.post("/ingest/dir")
async def ingest_dir(path: str):
    """
    Endpoint para ingerir todos os arquivos de um diretório.
    """
    return {
        "status": "success",
        "path": path,
        "message": f"Directory {path} ingestion initiated"
    }


@app.post("/files/write", response_model=FileWriteResponse)
async def write_file(request: FileWriteRequest):
    """
    Endpoint para criar/escrever notas locais.
    """
    return FileWriteResponse(
        status="success",
        filename=request.filename
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
