import pytest
from fastapi.testclient import TestClient
from main import app
import io


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


class TestChatEndpoint:
    """Tests for the /chat endpoint."""

    def test_chat_success(self, client):
        """Test successful chat request."""
        response = client.post(
            "/chat",
            json={"message": "Hello, assistant!"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "Echo: Hello, assistant!" == data["response"]

    def test_chat_empty_message(self, client):
        """Test chat with empty message."""
        response = client.post(
            "/chat",
            json={"message": ""}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["response"] == "Echo: "

    def test_chat_missing_message(self, client):
        """Test chat with missing message field."""
        response = client.post(
            "/chat",
            json={}
        )
        assert response.status_code == 422  # Unprocessable Entity


class TestIngestFileEndpoint:
    """Tests for the /ingest/file endpoint."""

    def test_ingest_file_success(self, client):
        """Test successful file ingestion."""
        file_content = b"This is a test file content"
        files = {"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
        
        response = client.post("/ingest/file", files=files)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["filename"] == "test.txt"
        assert data["size"] == len(file_content)
        assert "message" in data

    def test_ingest_pdf_file(self, client):
        """Test PDF file ingestion."""
        file_content = b"%PDF-1.4 mock pdf content"
        files = {"file": ("document.pdf", io.BytesIO(file_content), "application/pdf")}
        
        response = client.post("/ingest/file", files=files)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["filename"] == "document.pdf"

    def test_ingest_markdown_file(self, client):
        """Test markdown file ingestion."""
        file_content = b"# Test Markdown\n\nThis is a test."
        files = {"file": ("notes.md", io.BytesIO(file_content), "text/markdown")}
        
        response = client.post("/ingest/file", files=files)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["filename"] == "notes.md"

    def test_ingest_file_missing(self, client):
        """Test file ingestion without file."""
        response = client.post("/ingest/file")
        assert response.status_code == 422  # Unprocessable Entity


class TestIngestDirEndpoint:
    """Tests for the /ingest/dir endpoint."""

    def test_ingest_dir_success(self, client):
        """Test successful directory ingestion."""
        response = client.post(
            "/ingest/dir",
            params={"path": "/home/user/documents"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["path"] == "/home/user/documents"
        assert "message" in data

    def test_ingest_dir_relative_path(self, client):
        """Test directory ingestion with relative path."""
        response = client.post(
            "/ingest/dir",
            params={"path": "./documents"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["path"] == "./documents"

    def test_ingest_dir_missing_path(self, client):
        """Test directory ingestion without path parameter."""
        response = client.post("/ingest/dir")
        assert response.status_code == 422  # Unprocessable Entity


class TestFilesWriteEndpoint:
    """Tests for the /files/write endpoint."""

    def test_write_file_success(self, client):
        """Test successful file write."""
        response = client.post(
            "/files/write",
            json={
                "filename": "note.txt",
                "content": "This is my note content"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["filename"] == "note.txt"

    def test_write_file_markdown(self, client):
        """Test writing markdown file."""
        response = client.post(
            "/files/write",
            json={
                "filename": "note.md",
                "content": "# Title\n\nContent here"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["filename"] == "note.md"

    def test_write_file_empty_content(self, client):
        """Test writing file with empty content."""
        response = client.post(
            "/files/write",
            json={
                "filename": "empty.txt",
                "content": ""
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"

    def test_write_file_missing_filename(self, client):
        """Test file write without filename."""
        response = client.post(
            "/files/write",
            json={"content": "Some content"}
        )
        assert response.status_code == 422  # Unprocessable Entity

    def test_write_file_missing_content(self, client):
        """Test file write without content."""
        response = client.post(
            "/files/write",
            json={"filename": "test.txt"}
        )
        assert response.status_code == 422  # Unprocessable Entity


class TestRootEndpoint:
    """Tests for the root endpoint."""

    def test_root(self, client):
        """Test root endpoint returns welcome message."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Tronco-ia" in data["message"]
