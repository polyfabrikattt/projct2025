document.addEventListener('DOMContentLoaded', () => {
  // Получаем элементы DOM
  const taskList = document.getElementById('taskList');
  const taskModal = document.getElementById('taskModal');
  const taskForm = document.getElementById('taskForm');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const statusFilter = document.getElementById('statusFilter');
  const sortFilter = document.getElementById('sortFilter');
  const closeModal = document.querySelector('.close');

  // Получаем задачи из localStorage или инициализируем пустой массив
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let editingTaskId = null;

/**
 * Сохраняет список задач в локальное хранилище браузера.
 *
 * Эта функция преобразует массив задач в строку JSON и сохраняет его
 * в локальное хранилище под ключом 'tasks'. Это позволяет сохранять
 * состояние задач между сессиями, чтобы пользователь мог вернуться
 * к своим задачам позже.
 *
 * @function saveTasks
 * @returns {void} Эта функция не возвращает значения.
 *
 */
 const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

  // Отображает задачи на странице
  const renderTasks = () => {
    taskList.innerHTML = '';
  }
  

    ```javascript
    /**
     * Фильтрует задачи на основе выбранного статуса.
     *
     * @param {Array<Object>} tasks - Массив задач, где каждая задача является объектом.
     * @param {Object} statusFilter - Объект, содержащий свойство ``` ```value``` ``` , которое определяет текущий фильтр статуса.
     * @param {string} statusFilter.value - Значение фильтра статуса. Может быть 'all' или любым другим значением статуса задачи.
     * @returns {Array<Object>} Отфильтрованный массив задач, соответствующих выбранному статусу.
     ```
    const filteredTasks = tasks.filter(task => {
      if (statusFilter.value === 'all') return true;
      return task.status === statusFilter.value;
    });
    

    ```javascript
    /**
     * Сортирует отфильтрованные задачи на основе выбранного критерия сортировки.
     *
     * @param {Array<Object>} filteredTasks - Массив отфильтрованных задач, где каждая задача является объектом.
     * @param {Object} sortFilter - Объект, содержащий свойство  ``` ```value``` ``` , которое определяет текущий критерий сортировки.
     * @param {string} sortFilter.value - Значение критерия сортировки. Может быть 'createdAt' для сортировки по дате создания или 'title' для сортировки по названию.
     * @returns {Array<Object>} Отсортированный массив задач, соответствующих выбранному критерию сортировки.
     */
     ```
    filteredTasks.sort((a, b) => {
      if (sortFilter.value === 'createdAt') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortFilter.value === 'title') {
        return a.title.localeCompare(b.title);
      }
    });

    

    ```javascript
    /**
     * Добавляет отсортированные задачи в список на веб-странице.
     *
     * @param {Array<Object>} filteredTasks - Массив отсортированных задач, где каждая задача является объектом.
     * @param {HTMLElement} taskList - Элемент DOM, в который будут добавлены задачи.
     *
     * @property {string} task.title - Название задачи.
     * @property {string} task.description - Описание задачи.
     * @property {string} task.deadline - Дедлайн задачи.
     * @property {Array<string>} task.tags - Массив тегов, связанных с задачей.
     * @property {string} task.status - Статус задачи ('pending' или 'completed').
     * @property {string} task.id - Уникальный идентификатор задачи.
     */    ```
    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p class="deadline">Дедлайн: ${task.deadline}</p>
        <div class="tags">${task.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
        <div class="status">${task.status === 'pending' ? 'В процессе' : 'Завершено'}</div>
        <button class="edit-btn" data-id="${task.id}">Редактировать</button>
        <button class="delete-btn" data-id="${task.id}">Удалить</button>
      `;
      taskList.appendChild(li);
    });
 
    

    
 
    ```javascript
    /**
     * Добавляет обработчики событий для кнопок редактирования и удаления задач.
     *
     * @function
     *
     * @param {Function} editTask - Функция, вызываемая при нажатии на кнопку редактирования задачи.
     * @param {string} editTask.id - Уникальный идентификатор задачи, передаваемый в функцию редактирования.
     *
     * @param {Function} deleteTask - Функция, вызываемая при нажатии на кнопку удаления задачи.
     * @param {string} deleteTask.id - Уникальный идентификатор задачи, передаваемый в функцию удаления.
     */
     ```
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', () => editTask(button.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', () => deleteTask(button.dataset.id));
    });
  
    
   

/**
 * Отображает модальное окно для редактирования или создания задачи.
 *
 * @param {Object} [task={}] - Объект задачи, содержащий информацию о задаче.
 * @param {string} [task.title] - Название задачи.
 * @param {string} [task.description] - Описание задачи.
 * @param {string} [task.deadline] - Дедлайн задачи.
 * @param {Array<string>} [task.tags] - Массив тегов, связанных с задачей.
 * @param {string} [task.status] - Статус задачи ('pending' или 'completed').
 * @param {string} [task.id] - Уникальный идентификатор задачи.
 *
 * @property {HTMLElement} taskModal - Элемент DOM, представляющий модальное окно.
 * @property {Object} taskForm - Объект формы, содержащий поля для ввода информации о задаче.
 */
 const showModal = (task = {}) => {
  taskModal.style.display = 'block';
  taskForm.title.value = task.title || '';
  taskForm.description.value = task.description || '';
  taskForm.deadline.value = task.deadline || '';
  taskForm.tags.value = task.tags ? task.tags.join(', ') : '';
  taskForm.status.value = task.status || 'pending';
  editingTaskId = task.id || null;
};

/**
 * Скрывает модальное окно и сбрасывает форму задачи.
 *
 * @function
 *
 * @property {HTMLElement} taskModal - Элемент DOM, представляющий модальное окно.
 * @property {Object} taskForm - Объект формы, содержащий поля для ввода информации о задаче.
 * @property {string|null} editingTaskId - Уникальный идентификатор редактируемой задачи, устанавливается в null при сбросе.
 */
 const hideModal = () => {
  taskModal.style.display = 'none';
  taskForm.reset();
  editingTaskId = null;
};

 

/**
 * Добавляет новую задачу в список задач, сохраняет изменения и обновляет отображение задач.
 *
 * @param {Object} task - Объект задачи, содержащий информацию о задаче.
 * @param {string} task.title - Название задачи.
 * @param {string} task.description - Описание задачи.
 * @param {string} task.deadline - Дедлайн задачи.
 * @param {Array<string>} task.tags - Массив тегов, связанных с задачей.
 * @param {string} task.status - Статус задачи ('pending' или 'completed').
 * @param {string} task.id - Уникальный идентификатор задачи.
 *
 * @property {Array<Object>} tasks - Массив задач, в который добавляется новая задача.
 * @function saveTasks - Функция для сохранения списка задач.
 * @function renderTasks - Функция для обновления отображения задач.
 */
 const addTask = (task) => {
  tasks.push(task);
  saveTasks();
  renderTasks();
};

  

/**
 * Обновляет существующую задачу в списке задач, сохраняет изменения и обновляет отображение задач.
 *
 * @param {string} id - Уникальный идентификатор задачи, которую необходимо обновить.
 * @param {Object} updatedTask - Объект с обновленной информацией о задаче.
 * @param {string} [updatedTask.title] - Название задачи.
 * @param {string} [updatedTask.description] - Описание задачи.
 * @param {string} [updatedTask.deadline] - Дедлайн задачи.
 * @param {Array<string>} [updatedTask.tags] - Массив тегов, связанных с задачей.
 * @param {string} [updatedTask.status] - Статус задачи ('pending' или 'completed').
 *
 * @property {Array<Object>} tasks - Массив задач, в котором обновляется задача.
 * @function saveTasks - Функция для сохранения списка задач.
 * @function renderTasks - Функция для обновления отображения задач.
 */
 const updateTask = (id, updatedTask) => {
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedTask };
    saveTasks();
    renderTasks();
  }
};

  

/**
 * Удаляет задачу из списка задач после подтверждения, сохраняет изменения и обновляет отображение задач.
 *
 * @param {string} id - Уникальный идентификатор задачи, которую необходимо удалить.
 *
 * @property {Array<Object>} tasks - Массив задач, из которого удаляется задача.
 * @function saveTasks - Функция для сохранения списка задач.
 * @function renderTasks - Функция для обновления отображения задач.
 */
 const deleteTask = (id) => {
  if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }
};

 
/**
 * Открывает модальное окно для редактирования задачи с указанным идентификатором.
 *
 * @param {string} id - Уникальный идентификатор задачи, которую необходимо отредактировать.
 *
 * @property {Array<Object>} tasks - Массив задач, из которого извлекается задача для редактирования.
 * @function showModal - Функция для отображения модального окна с информацией о задаче.
 */
 const editTask = (id) => {
  const task = tasks.find(task => task.id === id);
  showModal(task);
};

 
  /**
 * Обработчик события отправки формы задачи.
 * Собирает данные из формы, создает или обновляет задачу и скрывает модальное окно.
 *
 * @param {Event} e - Объект события отправки формы.
 *
 * @property {Object} taskForm - Объект формы, содержащий поля для ввода информации о задаче.
 * @property {string} taskForm.title.value - Название задачи.
 * @property {string} taskForm.description.value - Описание задачи.
 * @property {string} taskForm.deadline.value - Дедлайн задачи.
 * @property {string} taskForm.tags.value - Теги задачи, разделенные запятыми.
 * @property {string} taskForm.status.value - Статус задачи ('pending' или 'completed').
 *
 * @function addTask - Функция для добавления новой задачи.
 * @function updateTask - Функция для обновления существующей задачи.
 * @function hideModal - Функция для скрытия модального окна.
 */
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskForm.title.value.trim();
  const description = taskForm.description.value.trim();
  const deadline = taskForm.deadline.value;
  const tags = taskForm.tags.value.split(',').map(tag => tag.trim()).filter(tag => tag);
  const status = taskForm.status.value;

  

    // Валидация данных
    if (!title) {
      alert('Название задачи не может быть пустым');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
      alert('Дедлайн должен быть в формате YYYY-MM-DD');
      return;
    }

    if (tags.length === 0) {
      alert('Теги не могут быть пустыми');
      return;
    }

    // Создаем объект задачи
    const task = {
      id: editingTaskId || Date.now().toString(),
      title,
      description,
      deadline,
      tags,
      status,
      createdAt: editingTaskId ? tasks.find(task => task.id === editingTaskId).createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: editingTaskId ? tasks.find(task => task.id === editingTaskId).history : []
    };

    // Добавляем или обновляем задачу
    if (editingTaskId) {
      task.history.push({ action: 'updated', timestamp: new Date().toISOString() });
      updateTask(editingTaskId, task);
    } else {
      task.history.push({ action: 'created', timestamp: new Date().toISOString() });
      addTask(task);
    }

    hideModal();
  });

  // Открывает модальное окно для добавления новой задачи
  addTaskBtn.addEventListener('click', () => {
    showModal();
  });

  // Скрывает модальное окно при нажатии на кнопку "Отмена"
  cancelBtn.addEventListener('click', hideModal);
  closeModal.addEventListener('click', hideModal);

  // Обновляет отображение задач при изменении фильтра статуса или сортировки
  statusFilter.addEventListener('change', renderTasks);
  sortFilter.addEventListener('change', renderTasks);

  // Первоначальное отображение задач
  renderTasks();
});
