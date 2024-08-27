
//document.getElementById('openProductModalButton').addEventListener('click', function() {
//    document.getElementById('productModal').style.display = 'block';
//});

 document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.product-checkbox').forEach(function(checkbox) {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        this.closest('tr').classList.add('selected-row');
                    } else {
                        this.closest('tr').classList.remove('selected-row');
                    }
                });
            });
        });


document.querySelectorAll('.product-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const deleteSelectedButton = document.getElementById("deleteSelectedButton");
        const anyChecked = document.querySelector('.product-checkbox:checked');
        deleteSelectedButton.style.display = anyChecked ? 'block' : 'none';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const deleteSelectedButton = document.getElementById("deleteSelectedButton");

    // Initially hide the delete button
    deleteSelectedButton.style.display = 'none';

    // Button click event
    deleteSelectedButton.onclick = function() {
        const checkedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
        const ids = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

        if (ids.length === 0) {
            alert('Please select at least one product to delete.');
            return;
        }

        // Show confirmation modal
        const deleteSelectedConfirmationModal = document.getElementById('deleteSelectedConfirmationModal');
        deleteSelectedConfirmationModal.style.display = 'block';

        document.getElementById('deleteSelectedYes').onclick = function() {
            const description = encodeURIComponent(new URLSearchParams(window.location.search).get('description') || '');
            const sort = encodeURIComponent(new URLSearchParams(window.location.search).get('sort') || '');

            fetch('/product/delete-multiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    ids: ids.join(','),
                    description: description,
                    sort: sort
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Reload the page with the current filters and sorting
                    window.location.search = `description=${data.description || ''}&sort=${data.sort || ''}`;
                } else {
                    alert('An error occurred while deleting the products.');
                }
            })
            .catch(error => console.error('Error deleting products:', error));

            // Hide confirmation modal
            deleteSelectedConfirmationModal.style.display = 'none';
        };

        document.getElementById('deleteSelectedNo').onclick = function() {
            deleteSelectedConfirmationModal.style.display = 'none';
        };
    };
});




           function confirmDelete(productId) {
             const confirmationModal = document.getElementById("confirmationModal");
             confirmationModal.style.display = "block";

             const yesButton = document.getElementById("confirmationYes");
             const noButton = document.getElementById("confirmationNo");

             yesButton.onclick = function() {
                 const currentUrl = new URL(window.location.href);
                 const description = encodeURIComponent(currentUrl.searchParams.get('description') || '');
                 const sortOrder = encodeURIComponent(currentUrl.searchParams.get('sort') || '');

                 const form = document.createElement('form');
                 form.method = 'POST';
                 form.action = `/product/delete/${productId}`;

                 form.innerHTML = `<input type="hidden" name="description" value="${description}">
                                   <input type="hidden" name="sort" value="${sortOrder}">`;

                 document.body.appendChild(form);
                 form.submit();
             };

             noButton.onclick = function() {
                 confirmationModal.style.display = "none";
             };
         }
  function openEditModal(productId) {
                                                              var editModal = document.getElementById("editProductModal");
                                                              var form = document.getElementById("editProductForm");

                                                              fetch('/product/edit/' + productId)
                                                                  .then(response => {
                                                                      if (!response.ok) {
                                                                          throw new Error('Network response was not ok');
                                                                      }
                                                                      return response.json();
                                                                  })
                                                                  .then(data => {
                                                                      document.getElementById("editProductId").value = data.id;
                                                                      document.getElementById("editProductName").value = data.name;
                                                                      document.getElementById("editProductDescription").value = data.description;
                                                                      document.getElementById("editProductPrice").value = data.price;
                                                                       document.getElementById("editProductQuantity").value = data.quantity; // Set quantity
                                                                      editModal.style.display = "block";
                                                                      document.body.style.overflow = "hidden";
                                                                  })
                                                                  .catch(error => console.error('Error fetching product:', error));

                                                              form.onsubmit = function(event) {
                                                                  event.preventDefault();
                                                                  var formData = new FormData(form);

                                                                  fetch('/product/save-api', {
                                                                      method: 'POST',
                                                                      body: formData
                                                                  })
                                                                  .then(response => {
                                                                      if (!response.ok) {
                                                                          return response.json().then(data => {
                                                                              return Promise.reject(data);
                                                                          });
                                                                      }
                                                                      return response.json();
                                                                  })
                                                                  .then(data => {
                                                                      if (data.success) {
                                                                          const updateModal = document.getElementById("updateModel");
                                                                          updateModal.style.display = "block";
                                                                          document.getElementById("editOk").onclick = function() {
                                                                              location.reload();
                                                                          };
                                                                      } else {
                                                                          document.getElementById("editNameError").textContent = data.errors.name || '';
                                                                          document.getElementById("editDescriptionError").textContent = data.errors.description || '';
                                                                          document.getElementById("editPriceError").textContent = data.errors.price || '';
                                                                                  document.getElementById("editQuantityError").textContent = error.errors.quantity || '';
                                                                      }
                                                                  })
                                                                  .catch(error => {
                                                                      if (error.errors) {
                                                                          document.getElementById("editNameError").textContent = error.errors.name || '';
                                                                          document.getElementById("editDescriptionError").textContent = error.errors.description || '';
                                                                          document.getElementById("editPriceError").textContent = error.errors.price || '';
                                                                           document.getElementById("editQuantityError").textContent = error.errors.quantity || '';
                                                                      } else {
                                                                          console.error('Error saving product:', error);
                                                                      }
                                                                  });
                                                              }
                                                          }

                                                          document.addEventListener("DOMContentLoaded", function() {
                                                              var addModal = document.getElementById("productModal");
                                                              var editModal = document.getElementById("editProductModal");
                                                              var openAddModalButton = document.getElementById("openModalButton");
                                                              var closeAddModalButton = document.getElementById("closeModalButton");
                                                              var closeEditModalButton = document.getElementById("closeEditModalButton");

                                                              // Open and close modal functions
                                                              openAddModalButton.onclick = function() {
                                                                  addModal.style.display = "block";
                                                                  document.body.style.overflow = "hidden";
                                                              }

                                                              closeAddModalButton.onclick = function() {
                                                                  addModal.style.display = "none";
                                                                  document.body.style.overflow = "auto";
                                                              }

                                                              closeEditModalButton.onclick = function() {
                                                                  editModal.style.display = "none";
                                                                  document.body.style.overflow = "auto";
                                                              }

                                                              window.onclick = function(event) {
                                                                  if (event.target == addModal) {
                                                                      addModal.style.display = "none";
                                                                      document.body.style.overflow = "auto";
                                                                  } else if (event.target == editModal) {
                                                                      editModal.style.display = "none";
                                                                      document.body.style.overflow = "auto";
                                                                  }
                                                              }

                                                              // Form submission for Add Product with validation
                                                              document.getElementById("addProductForm").onsubmit = function(event) {
                                                                  event.preventDefault();

                                                                  let isValid = true;

                                                                  // Get form elements
                                                                  const nameInput = document.getElementById("productName");
                                                                  const descriptionInput = document.getElementById("productDescription");
                                                                  const priceInput = document.getElementById("productPrice");
                                                                   const quantityInput = document.getElementById("productQuantity"); // New Quantity Input

                                                                  // Get error message spans
                                                                  const nameError = document.getElementById("nameError");
                                                                  const descriptionError = document.getElementById("descriptionError");
                                                                  const priceError = document.getElementById("priceError");
                                                                    const quantityError = document.getElementById("quantityError"); // New Quantity Error

                                                                  // Clear previous error messages
                                                                  nameError.textContent = "";
                                                                  descriptionError.textContent = "";
                                                                  priceError.textContent = "";
                                                                   quantityError.textContent = ""; // Clear Quantity Error

                                                                  // Validation logic
                                                                  if (nameInput.value.trim() === "") {
                                                                      nameError.textContent = "Product name is required.";
                                                                      isValid = false;
                                                                  }

                                                                  if (descriptionInput.value.trim() === "") {
                                                                      descriptionError.textContent = "Category is required.";
                                                                      isValid = false;
                                                                  }

                                                                  if (priceInput.value.trim() === "" || isNaN(priceInput.value) || parseFloat(priceInput.value) <= 0) {
                                                                      priceError.textContent = "A valid price is required.";
                                                                      isValid = false;
                                                                  }

                                                                    if (quantityInput.value.trim() === "" || isNaN(quantityInput.value) || parseInt(quantityInput.value) <= 0) {
                                                                              quantityError.textContent = "A valid quantity is required."; // Validate Quantity
                                                                              isValid = false;
                                                                          }

                                                                  // If form is valid, submit the form
                                                                  if (isValid) {
                                                                      this.submit();
                                                                  }
                                                              };
                                                          });

                                                              function sortProducts() {
                                                                  var sortOrder = document.getElementById('sort-dropdown').value;
                                                                  var currentUrl = new URL(window.location.href);
                                                                  currentUrl.searchParams.set('sort', sortOrder);
                                                                  window.location.href = currentUrl.toString();
                                                              }

                                                              function filterByCategory() {
                                                                  document.getElementById("filterForm").submit();
                                                              }
