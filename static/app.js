// Estado da aplicação
let currentConversationId = null;
let isLoading = false;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    await checkStatus();
    await loadDocuments();
    await loadConversations();
    await loadNotes();
}

function setupEventListeners() {
    // Enter para enviar mensagem
    document.getElementById('chat-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Upload de arquivo
    document.getElementById('file-input').addEventListener('change', handleFileUpload);
}

// Status do sistema
async function checkStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        
        if (data.status === 'online') {
            statusIndicator.classList.add('online');
            statusText.textContent = `Online | ${data.ai_provider} | ${data.documents_count} docs | ${data.conversations_count} conversas`;
        } else {
            statusIndicator.classList.add('offline');
            statusText.textContent = 'Sistema offline';
        }
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Erro ao conectar';
    }
}

// Chat
async function sendMessage() {
    if (isLoading) return;
    
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Limpa input
    input.value = '';
    
    // Mostra mensagem do usuário
    addMessageToChat('user', message);
    
    // Mostra indicador de carregamento
    isLoading = true;
    const loadingId = addLoadingMessage();
    
    try {
        const useContext = document.getElementById('use-context').checked;
        
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversation_id: currentConversationId,
                use_context: useContext
            })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao enviar mensagem');
        }
        
        const data = await response.json();
        
        // Atualiza ID da conversa
        currentConversationId = data.conversation_id;
        
        // Remove loading e mostra resposta
        removeLoadingMessage(loadingId);
        addMessageToChat('assistant', data.response);
        
        // Atualiza lista de conversas
        await loadConversations();
        
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        removeLoadingMessage(loadingId);
        addMessageToChat('assistant', 'Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se o provedor de IA está configurado corretamente.');
    } finally {
        isLoading = false;
    }
}

function addMessageToChat(role, content) {
    const messagesDiv = document.getElementById('chat-messages');
    
    // Remove mensagem de boas-vindas se existir
    const welcomeMessage = messagesDiv.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = role === 'user' ? '👤' : '🤖';
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div>
            <div class="message-content">${escapeHtml(content)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addLoadingMessage() {
    const messagesDiv = document.getElementById('chat-messages');
    const loadingId = 'loading-' + Date.now();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = loadingId;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div>
            <div class="message-content">Pensando...</div>
        </div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    return loadingId;
}

function removeLoadingMessage(loadingId) {
    const loadingMessage = document.getElementById(loadingId);
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

function startNewConversation() {
    currentConversationId = null;
    const messagesDiv = document.getElementById('chat-messages');
    messagesDiv.innerHTML = `
        <div class="welcome-message">
            <h2>Nova Conversa 👋</h2>
            <p>Comece uma nova conversa fazendo uma pergunta!</p>
        </div>
    `;
}

// Documentos
async function loadDocuments() {
    try {
        const response = await fetch('/api/documents');
        const documents = await response.json();
        
        const listDiv = document.getElementById('documents-list');
        
        if (documents.length === 0) {
            listDiv.innerHTML = '<p class="loading">Nenhum documento enviado ainda</p>';
            return;
        }
        
        listDiv.innerHTML = documents.map(doc => `
            <div class="list-item">
                <div class="list-item-title">
                    📄 ${escapeHtml(doc.filename)}
                    <span class="status-badge ${escapeHtml(doc.status)}">${escapeHtml(doc.status)}</span>
                </div>
                <div class="list-item-meta">
                    ${doc.total_chunks} chunks | ${new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar documentos:', error);
    }
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        // Mostra feedback
        const listDiv = document.getElementById('documents-list');
        listDiv.innerHTML = '<p class="loading">Enviando documento...</p>';
        
        const response = await fetch('/api/documents/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Erro ao enviar documento');
        }
        
        const data = await response.json();
        
        // Recarrega lista de documentos
        await loadDocuments();
        
        // Limpa input
        event.target.value = '';
        
        alert(`Documento "${data.filename}" enviado com sucesso!`);
    } catch (error) {
        console.error('Erro ao enviar documento:', error);
        alert('Erro ao enviar documento: ' + error.message);
        await loadDocuments();
    }
}

// Conversas
async function loadConversations() {
    try {
        const response = await fetch('/api/conversations');
        const conversations = await response.json();
        
        const listDiv = document.getElementById('conversations-list');
        
        if (conversations.length === 0) {
            listDiv.innerHTML = '<p class="loading">Nenhuma conversa ainda</p>';
            return;
        }
        
        listDiv.innerHTML = conversations.map(conv => `
            <div class="list-item" onclick="loadConversation(${conv.id})">
                <div class="list-item-title">💬 ${escapeHtml(conv.title)}</div>
                <div class="list-item-meta">
                    ${new Date(conv.updated_at).toLocaleDateString('pt-BR')}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar conversas:', error);
    }
}

async function loadConversation(conversationId) {
    try {
        currentConversationId = conversationId;
        
        const response = await fetch(`/api/conversations/${conversationId}/messages`);
        const messages = await response.json();
        
        const messagesDiv = document.getElementById('chat-messages');
        messagesDiv.innerHTML = '';
        
        messages.forEach(msg => {
            addMessageToChat(msg.role, msg.content);
        });
    } catch (error) {
        console.error('Erro ao carregar conversa:', error);
    }
}

// Notas
async function loadNotes() {
    try {
        const response = await fetch('/api/notes');
        const notes = await response.json();
        
        const listDiv = document.getElementById('notes-list');
        
        if (notes.length === 0) {
            listDiv.innerHTML = '<p class="loading">Nenhuma nota criada ainda</p>';
            return;
        }
        
        listDiv.innerHTML = notes.map(note => `
            <div class="list-item">
                <div class="list-item-title">📝 ${escapeHtml(note.title)}</div>
                <div class="list-item-meta">
                    ${escapeHtml(note.tags || 'Sem tags')} | ${new Date(note.created_at).toLocaleDateString('pt-BR')}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar notas:', error);
    }
}

function showNoteModal() {
    const modal = document.getElementById('note-modal');
    modal.classList.add('show');
}

function closeNoteModal() {
    const modal = document.getElementById('note-modal');
    modal.classList.remove('show');
    document.getElementById('note-form').reset();
}

async function saveNote(event) {
    event.preventDefault();
    
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const tags = document.getElementById('note-tags').value;
    
    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, tags })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao salvar nota');
        }
        
        await loadNotes();
        closeNoteModal();
        alert('Nota salva com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar nota:', error);
        alert('Erro ao salvar nota: ' + error.message);
    }
}

// Utilitários
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
}

// Fecha modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('note-modal');
    if (event.target === modal) {
        closeNoteModal();
    }
}
