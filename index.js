document.addEventListener("DOMContentLoaded", function() {
    const incompleteList = document.querySelector(".incomplete-list ul");
    const completeList = document.querySelector(".complete-list ul");
    const btnClick = document.querySelector(".btn-add-image");
    const showAllLink = document.getElementById("showalllink");
    const completeLink = document.getElementById("completelink");
    const pendingLink = document.getElementById("pendinglink");

    loadItemsFromLocalStorage();

    function addItemToIncompleteList(item, bgColor) {
        incompleteList.insertBefore(item, incompleteList.firstChild);
        item.style.backgroundColor = bgColor || 'hsl(271, 32%, 72%)';
        saveItemsToLocalStorage();
        console.log('Item added to incomplete list');
    }

    function saveItemsToLocalStorage() {
        const allItems = Array.from(incompleteList.children).concat(Array.from(completeList.children));
        const itemsData = allItems.map(item => {
            return {
                text: item.querySelector('.textNodeClass').textContent,
                color: item.style.backgroundColor
            };
        });
        localStorage.setItem('todoItems', JSON.stringify(itemsData));
    }

    function loadItemsFromLocalStorage() {
        const itemsData = JSON.parse(localStorage.getItem('todoItems'));
        if (itemsData) {
            itemsData.forEach(itemData => {
                const listItem = createListItem(itemData.text);
                listItem.style.backgroundColor = itemData.color;
                if (itemData.color === 'hsl(359, 54%, 72%)') {
                    completeList.appendChild(listItem);
                } else {
                    incompleteList.appendChild(listItem);
                }
            });
        }
    }

    function createListItem(text) {
        const listItem = document.createElement('li');
        listItem.classList.add('listItemClass');

        const textNode = document.createElement('div');
        textNode.textContent = text;
        textNode.classList.add('textNodeClass');

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = false;
        checkBox.classList.add('checkbox-wrapper-15');

        checkBox.addEventListener('change', function() {
            if (checkBox.checked) {
                completeList.appendChild(listItem);
                listItem.style.backgroundColor = 'hsl(359, 54%, 72%)';
                listItem.classList.add('completed');
                saveItemsToLocalStorage();
                console.log('Item moved to complete list');
            } else {
                incompleteList.insertBefore(listItem, incompleteList.firstChild);
                listItem.style.backgroundColor = 'hsl(271, 32%, 72%)';
                listItem.classList.remove('completed');
                saveItemsToLocalStorage();
                console.log('Item moved to incomplete list');
            }
        });

        const editIcon = document.createElement('img');
        editIcon.src = 'edit-text.png';
        editIcon.alt = "edit";
        editIcon.classList.add("editIconClass");

        editIcon.addEventListener('click', function() {
            const currentText = textNode.textContent;
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = currentText;
            inputField.classList.add('editedTClass');

            inputField.addEventListener('blur', function() {
                textNode.textContent = inputField.value;
                listItem.replaceChild(textNode, inputField);
                saveItemsToLocalStorage(); // Save items to local storage after editing
            });

            listItem.replaceChild(inputField, textNode);
            inputField.focus();
        });

        const deleteIcon = document.createElement('img');
        deleteIcon.src = 'close.png';
        deleteIcon.alt = "delete";
        deleteIcon.classList.add('deleteIconClass');

        deleteIcon.addEventListener('click', function() {
            listItem.remove();
            saveItemsToLocalStorage(); // Save items to local storage after deleting
            console.log('Item deleted');
        });

        listItem.appendChild(checkBox);
        listItem.appendChild(textNode);
        listItem.appendChild(editIcon);
        listItem.appendChild(deleteIcon);

        return listItem;
    }

    btnClick.addEventListener("click", function() {
        const inputValue = document.getElementById("add-text").value.trim();

        if (inputValue === "") {
            console.log("Input is empty. Please enter a value.");
            return;
        }

        const listItem = createListItem(inputValue);
        addItemToIncompleteList(listItem);

        document.getElementById('add-text').value = '';
    });

    // Event listeners for filter links
    showAllLink.addEventListener("click", function() {
        showAll();
    });

    completeLink.addEventListener("click", function() {
        showCompleted();
    });

    pendingLink.addEventListener("click", function() {
        showPending();
    });

    // Function to show all tasks
    function showAll() {
        Array.from(incompleteList.children).forEach(item => {
            item.style.display = "flex";
        });
        Array.from(completeList.children).forEach(item => {
            item.style.display = "flex";
        });
    }

    // Function to show only completed tasks
    function showCompleted() {
        Array.from(incompleteList.children).forEach(item => {
            item.style.display = "none";
        });
        Array.from(completeList.children).forEach(item => {
            item.style.display = "flex";
        });
    }

    // Function to show only pending tasks
    function showPending() {
        Array.from(incompleteList.children).forEach(item => {
            item.style.display = "flex";
        });
        Array.from(completeList.children).forEach(item => {
            item.style.display = "none";
        });
    }
});