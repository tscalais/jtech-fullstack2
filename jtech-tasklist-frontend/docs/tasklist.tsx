import React, { useState, useEffect, useRef } from 'react';

// --- Mock Data (Simulando Pinia/API) ---
const mockFolders = [
    { id: 'folder-1', name: 'Projeto Alpha', count: 12, icon: 'M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z' },
    { id: 'folder-2', name: 'Pessoal', count: 4, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { id: 'folder-3', name: 'Equipe Dev', count: 8, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M3 20h5V7m0 0v13m0-13h2m-2 0h-2M11 7h2m-2 0H3m8 0V4a2 2 0 00-2-2H5a2 2 0 00-2 2v3' },
];

const mockTasks = [
    { id: 'task-a', title: 'Criar interface de gerenciamento de membros', subtasks: 0, maxSubtasks: 5, completed: false, tags: [{name: 'Urgente', color: 'yellow'}, {name: 'Frontend', color: 'indigo'}] },
    { id: 'task-b', title: 'Implementar Autenticação JWT na API', subtasks: 3, maxSubtasks: 3, completed: true, tags: [{name: 'Backend', color: 'primary'}] },
    { id: 'task-c', title: 'Escrever a documentação de Swagger para Tags', subtasks: 1, maxSubtasks: 2, completed: false, tags: [{name: 'Documentação', color: 'gray'}] },
    { id: 'task-d', title: 'Configurar roteamento do Vue Router', subtasks: 0, maxSubtasks: 1, completed: false, tags: [{name: 'Frontend', color: 'indigo'}] },
];

// --- Componentes Reutilizáveis ---

// 1. FolderDropdown (Dropdown de Pastas)
const FolderDropdown = ({ folders, currentFolderId, selectFolder, toggleDropdown, isDropdownOpen }) => {
    const dropdownRef = useRef(null);

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (isDropdownOpen) toggleDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen, toggleDropdown]);

    const selectedFolder = folders.find(f => f.id === currentFolderId);

    return (
        <div id="folder-dropdown-container" className="relative" ref={dropdownRef}>
            <button
                id="folder-menu-button"
                className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-primary-600 transition duration-150 p-2 rounded-xl"
                onClick={toggleDropdown}
            >
                {/* Ícone Pasta (Mobile) */}
                <svg className="w-6 h-6 text-primary-600 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>

                {/* Nome da Pasta Selecionada (Desktop) */}
                <span id="selected-folder-display" className="hidden sm:block">
                    {selectedFolder ? selectedFolder.name : 'Carregando...'}
                </span>

                {/* Ícone Seta */}
                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} id="folder-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <div id="folder-dropdown-content" className={`absolute left-0 lg:left-1/2 lg:-translate-x-1/2 mt-2 w-64 md:w-72 bg-white rounded-xl shadow-2xl p-2 z-50 border border-gray-100 ${isDropdownOpen ? '' : 'panel-hidden'}`}>
                {/* Lista de Pastas */}
                <div className="space-y-1">
                    {folders.map(folder => (
                        <div
                            key={folder.id}
                            id={folder.id}
                            data-name={folder.name}
                            className={`folder-item flex items-center justify-between p-3 rounded-xl cursor-pointer transition duration-150 ${currentFolderId === folder.id ? 'bg-primary-500 text-white font-semibold shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
                            onClick={() => selectFolder(folder.id, folder.name)}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill={currentFolderId === folder.id ? 'currentColor' : 'none'} stroke={currentFolderId === folder.id ? 'none' : 'currentColor'} viewBox="0 0 24 24">
                                    <path d={folder.icon} fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                                <span>{folder.name}</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${currentFolderId === folder.id ? 'bg-white bg-opacity-30' : 'bg-gray-200'}`}>{folder.count}</span>
                        </div>
                    ))}
                </div>
                {/* Ações da Pasta */}
                <div className="p-2 border-t border-gray-200 mt-2 space-y-2">
                    <button className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-2 rounded-xl hover:bg-primary-700 transition duration-150 shadow-md text-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        <span>Nova Pasta</span>
                    </button>
                    <div className="flex space-x-2">
                        <input type="text" placeholder="Chave de Acesso" className="flex-grow p-2 border border-gray-300 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500" />
                        <button className="bg-gray-200 text-gray-700 p-2 rounded-xl hover:bg-gray-300 transition duration-150 text-sm font-medium">Entrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. Header (Barra Superior)
const Header = ({ folders, currentFolderId, selectFolder, toggleDropdown, isDropdownOpen }) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm p-4 flex items-center justify-between lg:justify-start lg:gap-6 z-20">
            <div className="flex items-center space-x-4">
                {/* Ícone da Aplicação */}
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0V3m0 2v4m0 0h2m-2 0H9m1.5-1.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5z"></path></svg>

                {/* Dropdown de Pastas */}
                <FolderDropdown
                    folders={folders}
                    currentFolderId={currentFolderId}
                    selectFolder={selectFolder}
                    toggleDropdown={toggleDropdown}
                    isDropdownOpen={isDropdownOpen}
                />
            </div>

            {/* Barra de Pesquisa */}
            <div className="flex-grow max-w-lg mx-4">
                <input type="search" placeholder="Buscar tarefas ou tags..." className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition duration-150 shadow-md" />
            </div>

            {/* Perfil/Ações */}
            <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-primary-600 p-2 rounded-full transition duration-150 mobile-hidden lg:block" aria-label="Notificações">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.456 5.378 6 7.234 6 9.5v5.658A2.032 2.032 0 013.405 17H7m8 0a.75.75 0 01.75.75H14.25a.75.75 0 01-.75-.75m.75 0V20"></path></svg>
                </button>
                <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition duration-150">
                    <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 font-medium text-sm">JS</div>
                    <span className="text-sm font-medium text-gray-700 mobile-hidden lg:block">João Silva</span>
                </div>
            </div>
        </header>
    );
};

// 3. QuickTaskForm (Formulário Rápido - Estilo Keep)
const QuickTaskForm = () => {
    return (
        <div className="w-full max-w-xl mx-auto mb-8 bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <input
                type="text"
                placeholder="Criar nova tarefa... (Ex: Implementar CRUD de Tasks)"
                className="w-full text-lg font-medium text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
            />
            <div className="mt-3 flex justify-end space-x-2">
                <button className="text-gray-400 hover:text-primary-600 p-1 rounded-full" title="Adicionar Tag">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5.99c.55 0 1 .45 1 1v5.99c0 .55-.45 1-1 1H7.01c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1zM17 17h.01M17 13h5.99c.55 0 1 .45 1 1v5.99c0 .55-.45 1-1 1H17.01c-.55 0-1-.45-1-1v-5.99c0-.55.45-1 1-1zM7 17h.01M7 13h5.99c.55 0 1 .45 1 1v5.99c0 .55-.45 1-1 1H7.01c-.55 0-1-.45-1-1v-5.99c0-.55.45-1 1-1z"></path></svg>
                </button>
                <button className="bg-primary-600 text-white py-1 px-3 rounded-lg hover:bg-primary-700 transition duration-150 text-sm font-medium shadow-md">Salvar</button>
            </div>
        </div>
    );
};

// 4. TaskCard (Card Individual da Tarefa)
const TaskCard = ({ task, showTaskDetails }) => {
    const borderColor = task.completed ? 'border-green-300' :
                        task.tags.some(t => t.name === 'Urgente') ? 'border-yellow-300' :
                        'border-gray-300';
    const subtaskIcon = "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01";

    // Simulação do ícone SVG de pasta, pois o original usa path complexo
    const TagSvgIcon = ({ color }) => (
        <span className={`tag-chip bg-${color}-100 text-${color}-600 text-xs font-semibold px-2 py-0.5 rounded-full`}>
            {`#${task.tags[0].name}`}
        </span>
    );

    return (
        <div
            className={`bg-white rounded-xl shadow-sm p-4 ${borderColor} border cursor-pointer hover:shadow-lg transition duration-200`}
            onClick={() => showTaskDetails(task.id)}
        >
            <p className={`text-lg font-bold text-gray-800 mb-2 ${task.completed ? 'line-through' : ''}`}>
                {task.title}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => e.stopPropagation()} // Impede o clique no card
                    className={`form-checkbox h-4 w-4 rounded border-gray-300 transition duration-150 ${task.completed ? 'text-green-500 focus:ring-green-500' : 'text-gray-400 focus:ring-primary-500'}`}
                />
                <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={subtaskIcon}></path></svg>
                    <span>{task.subtasks}/{task.maxSubtasks} Microtarefas</span>
                </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-auto">
                {task.tags.map(tag => (
                   <span key={tag.name} className={`tag-chip bg-${tag.color}-100 text-${tag.color}-600 text-xs font-semibold px-2 py-0.5 rounded-full`}>
                       #{tag.name}
                   </span>
                ))}
            </div>
        </div>
    );
};

// 5. TaskListGrid (Container do Grid de Tarefas)
const TaskListGrid = ({ tasks, showTaskDetails }) => {
    return (
        <div className="flex-1 overflow-y-auto pr-2 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-min">
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} showTaskDetails={showTaskDetails} />
            ))}
        </div>
    );
};

// 6. TagFilter (Filtros Rápidos)
const TagFilter = () => {
    const mockTags = ['Backend', 'Urgente', 'Documentação', 'Frontend'];
    const tagColors = {
        Backend: 'primary',
        Urgente: 'yellow',
        Documentação: 'gray',
        Frontend: 'indigo'
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6 w-full max-w-xl mx-auto lg:max-w-none lg:mx-0">
            <span className="text-sm font-medium text-gray-600">Filtro Rápido:</span>
            {mockTags.map(tag => (
                <button
                    key={tag}
                    className={`tag-chip bg-${tagColors[tag]}-100 text-${tagColors[tag]}-600 text-xs font-semibold px-3 py-1 rounded-full hover:bg-${tagColors[tag]}-200 transition duration-150`}
                >
                    #{tag}
                </button>
            ))}
        </div>
    );
};

// 7. TaskDetailsModal (Modal de Detalhes - Simulação de Subtasks/Tags/Membros)
const TaskDetailsModal = ({ task, closeModal }) => {
    if (!task) return null; // Não renderiza se não houver tarefa selecionada

    // Mock data para subtasks e membros
    const mockSubtasks = task.id === 'task-a' ? [
        { id: 1, text: 'Definir estrutura do payload JWT', completed: true },
        { id: 2, text: 'Configurar filtro Spring Security', completed: true },
        { id: 3, text: 'Testar endpoint protegido', completed: false },
    ] : task.id === 'task-b' ? [
        { id: 4, text: 'Esboçar layout no Figma', completed: false },
    ] : [];

    const memberIcon = "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20h18";
    const deleteIcon = "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";
    const completeIcon = "M5 13l4 4L19 7";

    return (
        <div id="detail-modal" className="modal-overlay">
            <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8 w-11/12 max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

                <div className="flex-shrink-0 flex items-center justify-between border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Detalhes da Tarefa</h2>
                    <button className="text-gray-500 hover:text-gray-800 p-1 rounded-full transition duration-150" aria-label="Fechar Detalhes" onClick={closeModal}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Conteúdo do Modal Scrollável */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                    {/* Título e Tags */}
                    <div className="space-y-2">
                        <h3 className="text-3xl font-extrabold text-gray-800">{task.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                            <span>Em: Projeto Alpha</span>
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {task.tags.map(tag => (
                                <span key={tag.name} className={`tag-chip bg-${tag.color}-100 text-${tag.color}-600 text-sm font-semibold px-3 py-1 rounded-full`}>
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Microtarefas (Subtasks) */}
                    <div>
                        <h4 className="text-xl font-semibold text-gray-700 mb-3">Microtarefas ({mockSubtasks.filter(s => s.completed).length}/{task.maxSubtasks})</h4>
                        <div className="space-y-3">
                            <div className="flex space-x-2">
                                <input type="text" placeholder="Adicionar nova microtarefa..." className="flex-grow p-2 border border-gray-300 rounded-xl text-sm focus:ring-primary-500 focus:border-primary-500" />
                                <button className="bg-primary-500 text-white p-2 rounded-xl hover:bg-primary-600 transition duration-150 text-sm font-medium">Add</button>
                            </div>
                            {mockSubtasks.map(subtask => (
                                <div key={subtask.id} className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200">
                                    <input type="checkbox" checked={subtask.completed} className={`form-checkbox h-4 w-4 rounded border-gray-300 transition duration-150 ${subtask.completed ? 'text-green-500 focus:ring-green-500' : 'text-gray-400 focus:ring-primary-500'}`} />
                                    <span className={`text-base text-gray-700 flex-1 ${subtask.completed ? 'line-through text-gray-500' : ''}`}>{subtask.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Membros da Pasta */}
                    <div>
                        <h4 className="text-xl font-semibold text-gray-700 mb-3">Membros da Pasta (Propriedade)</h4>
                        <p className="text-sm text-gray-500 mb-3">Todos os membros podem visualizar e manipular as tarefas.</p>
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 font-medium text-sm border-2 border-primary-500" title="João Silva (Owner)">JS</div>
                            <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-600 font-medium text-sm" title="Maria Souza">MS</div>
                            <button className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition duration-150" title="Gerenciar Membros">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={memberIcon}></path></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ações Fixas (Rodapé do Modal) */}
                <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button className="text-gray-500 hover:text-red-500 p-2 rounded-xl transition duration-150 font-medium flex items-center space-x-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={deleteIcon}></path></svg>
                        <span>Excluir</span>
                    </button>
                    <button className="flex items-center space-x-1 bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition duration-150 font-medium shadow-md" onClick={closeModal}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={completeIcon}></path></svg>
                        <span>Concluir e Fechar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal (App / Dashboard) ---
const App = () => {
    // 1. Estados Globais
    const [currentFolderId, setCurrentFolderId] = useState(mockFolders[0].id);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // 2. Funções de Manipulação
    const selectFolder = (id) => {
        setCurrentFolderId(id);
        setIsDropdownOpen(false); // Fecha o dropdown ao selecionar
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const showTaskDetails = (taskId) => {
        const task = mockTasks.find(t => t.id === taskId);
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const closeTaskDetails = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    // 3. Renderização
    return (
        <div className="h-screen overflow-hidden flex flex-col">
            <Header
                folders={mockFolders}
                currentFolderId={currentFolderId}
                selectFolder={selectFolder}
                toggleDropdown={toggleDropdown}
                isDropdownOpen={isDropdownOpen}
            />

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Task Panel (Content) */}
                <div id="task-panel" className="flex-1 min-w-0 bg-f7f9fc p-6 flex flex-col overflow-hidden z-10">
                    <QuickTaskForm />
                    <TagFilter />
                    <TaskListGrid tasks={mockTasks} showTaskDetails={showTaskDetails} />
                </div>
            </div>

            {/* Modal de Detalhes */}
            {isModalOpen && <TaskDetailsModal task={selectedTask} closeModal={closeTaskDetails} />}
        </div>
    );
};

// Configuração do Tailwind (repetida para garantir compatibilidade no sandbox)
const tailwindConfig = {
    theme: {
        extend: {
            colors: {
                primary: {
                    500: '#6366f1', // Indigo
                    600: '#4f46e5',
                },
                yellow: {
                    100: '#fef3c7',
                    600: '#d97706',
                },
                indigo: {
                    100: '#e0e7ff',
                    600: '#4f46e5',
                },
                green: {
                    500: '#22c55e',
                },
                red: {
                    200: '#fecaca',
                    600: '#dc2626',
                },
                gray: {
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                }
            }
        }
    }
};

// Inicializa o Tailwind se a função estiver disponível
if (typeof tailwind !== 'undefined') {
    tailwind.config = tailwindConfig;
}

// Exporta o componente principal para o Canvas
export default App;
