// Tronco-IA - Lógica do Frontend
// Gerencia a interface e comunicação com a API

let currentConversationId = null;
let currentEditingNoteId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌳 Tronco-IA inicializado');
    
    // Carrega providers disponíveis
    await loadProviders();
    
    // Configura event listeners
    setupEventListeners();
    
    // Carrega dados iniciais
    await loadNotes();
    await loadDocuments();
    
    // Verifica saúde da API
    checkHealth();
});

// Verifica status da API
async function checkHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('✅ API Status:', data);
    } catch (error) {
        console.error('❌ API não disponível:', error);
        showMessage('system', 'Erro: Não foi possível conectar à API');
    }
}

// Carrega providers de IA disponíveis
async function loadProviders() {
    try {
        const response = await fetch('/api/providers');
        const data = await response.json();
        const select = document.getElementById('providerSelect');
        
        select.innerHTML = '';
        
        if (data.providers && data.providers.length > 0) {
            data.providers.forEach(provider => {
                const option = document.createElement('option');
                option.value = provider;
                option.textContent = provider.charAt(0).toUpperCase() + provider.slice(1);
                select.appendChild(option);
            });
        } else {
            select.innerHTML = '<option value="">Nenhum provider disponível</option>';
            console.warn('⚠️ Nenhum provider de IA configurado');
        }
    } catch (error) {
        console.error('Erro ao carregar providers:', error);
    }
}

// Configura event listeners
function setupEventListeners() {
    // Enter para enviar mensagem
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Upload de arquivo no chat
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadFile(e.target.files[0]);
        }
    });
}

// Mostra/esconde tabs
function showTab(tabName) {
    // Esconde todas as tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostra tab selecionada
    const tabs = {
        'chat': 'chatTab',
        'notes': 'notesTab',
        'docs': 'docsTab'
    };
    
    const tabId = tabs[tabName];
    if (tabId) {
        document.getElementById(tabId).classList.add('active');
        
        // Recarrega dados se necessário
        if (tabName === 'notes') loadNotes();
        if (tabName === 'docs') loadDocuments();
    }
}

// Envia mensagem para a IA
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    const provider = document.getElementById('providerSelect').value;
    
    if (!message) return;
    if (!provider) {
        alert('Por favor, selecione um provider de IA');
        return;
    }
    
    // Limpa input
    input.value = '';
    
    // Mostra mensagem do usuário
    showMessage('user', message);
    
    // Mostra loading
    showLoading(true);
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                provider: provider,
                conversation_id: currentConversationId,
                use_context: true
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Salva ID da conversa
        currentConversationId = data.conversation_id;
        
        // Mostra resposta da IA
        showMessage('assistant', data.response);
        
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        showMessage('system', '❌ Erro ao processar mensagem. Verifique se o provider está configurado corretamente.');
    } finally {
        showLoading(false);
    }
}

// Mostra mensagem no chat
function showMessage(role, content) {
    const messagesContainer = document.getElementById('chatMessages');
    
    // Remove mensagem de boas-vindas se existir
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.textContent = content;
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll para o final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Upload de arquivo
async function uploadFile(file) {
    showLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        showMessage('system', `✅ Arquivo "${data.filename}" processado com sucesso!`);
        
        // Recarrega lista de documentos
        await loadDocuments();
        
    } catch (error) {
        console.error('Erro no upload:', error);
        showMessage('system', '❌ Erro ao processar arquivo');
    } finally {
        showLoading(false);
    }
}

// Upload de documento (tab de documentos)
async function uploadDocument(input) {
    if (input.files.length === 0) return;
    
    showLoading(true);
    
    const formData = new FormData();
    formData.append('file', input.files[0]);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await loadDocuments();
        alert('✅ Documento enviado com sucesso!');
        
    } catch (error) {
        console.error('Erro no upload:', error);
        alert('❌ Erro ao enviar documento');
    } finally {
        showLoading(false);
        input.value = ''; // Limpa input
    }
}

// Carrega lista de notas
async function loadNotes() {
    try {
        const response = await fetch('/api/notes');
        const data = await response.json();
        
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = '';
        
        if (data.notes && data.notes.length > 0) {
            data.notes.forEach(note => {
                const noteCard = createNoteCard(note);
                notesList.appendChild(noteCard);
            });
        } else {
            notesList.innerHTML = '<p style="text-align: center; color: #6b7280;">Nenhuma nota encontrada. Crie sua primeira nota!</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar notas:', error);
    }
}

// Cria card de nota
function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = 'note-card';
    
    const title = document.createElement('h3');
    title.textContent = note.title;
    
    const content = document.createElement('p');
    content.textContent = note.content.substring(0, 150) + (note.content.length > 150 ? '...' : '');
    
    const meta = document.createElement('div');
    meta.className = 'note-meta';
    meta.textContent = `Atualizada: ${new Date(note.updated_at).toLocaleDateString('pt-BR')}`;
    
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-secondary';
    editBtn.textContent = 'Editar';
    editBtn.onclick = (e) => {
        e.stopPropagation();
        editNote(note);
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteNote(note.id);
    };
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    
    card.appendChild(title);
    card.appendChild(content);
    card.appendChild(meta);
    card.appendChild(actions);
    
    return card;
}

// Mostra editor de nota
function showNoteEditor(note = null) {
    const editor = document.getElementById('noteEditor');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    const tagsInput = document.getElementById('noteTags');
    
    if (note) {
        currentEditingNoteId = note.id;
        titleInput.value = note.title;
        contentInput.value = note.content;
        tagsInput.value = note.tags || '';
    } else {
        currentEditingNoteId = null;
        titleInput.value = '';
        contentInput.value = '';
        tagsInput.value = '';
    }
    
    editor.style.display = 'block';
    titleInput.focus();
}

// Cancela edição de nota
function cancelNoteEdit() {
    document.getElementById('noteEditor').style.display = 'none';
    currentEditingNoteId = null;
}

// Salva nota
async function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    const tags = document.getElementById('noteTags').value.trim();
    
    if (!title || !content) {
        alert('Por favor, preencha título e conteúdo');
        return;
    }
    
    showLoading(true);
    
    try {
        let response;
        
        if (currentEditingNoteId) {
            // Atualiza nota existente
            response = await fetch('/api/notes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    note_id: currentEditingNoteId,
                    title,
                    content,
                    tags
                })
            });
        } else {
            // Cria nova nota
            response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, tags })
            });
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        cancelNoteEdit();
        await loadNotes();
        
    } catch (error) {
        console.error('Erro ao salvar nota:', error);
        alert('❌ Erro ao salvar nota');
    } finally {
        showLoading(false);
    }
}

// Edita nota
function editNote(note) {
    showNoteEditor(note);
}

// Deleta nota
async function deleteNote(noteId) {
    if (!confirm('Tem certeza que deseja excluir esta nota?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`/api/notes/${noteId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await loadNotes();
        
    } catch (error) {
        console.error('Erro ao deletar nota:', error);
        alert('❌ Erro ao deletar nota');
    } finally {
        showLoading(false);
    }
}

// Carrega lista de documentos
async function loadDocuments() {
    try {
        const response = await fetch('/api/documents');
        const data = await response.json();
        
        const docsList = document.getElementById('docsList');
        docsList.innerHTML = '';
        
        if (data.documents && data.documents.length > 0) {
            data.documents.forEach(doc => {
                const docCard = createDocCard(doc);
                docsList.appendChild(docCard);
            });
        } else {
            docsList.innerHTML = '<p style="text-align: center; color: #6b7280;">Nenhum documento encontrado. Faça upload do seu primeiro documento!</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar documentos:', error);
    }
}

// Cria card de documento
function createDocCard(doc) {
    const card = document.createElement('div');
    card.className = 'doc-card';
    
    const title = document.createElement('h3');
    title.textContent = doc.filename;
    
    const preview = document.createElement('p');
    preview.textContent = doc.content_preview || 'Documento processado';
    
    const meta = document.createElement('div');
    meta.className = 'doc-meta';
    meta.textContent = `Adicionado: ${new Date(doc.created_at).toLocaleDateString('pt-BR')} | Tipo: ${doc.file_type}`;
    
    card.appendChild(title);
    card.appendChild(preview);
    card.appendChild(meta);
    
    return card;
}

// Mostra/esconde loading
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}
