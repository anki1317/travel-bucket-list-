const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const destinationsHtml = document.querySelector(".destinations");
const emptyImage = document.querySelector(".empty-image");
let destinationsJson = JSON.parse(localStorage.getItem("destinations")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

showDestinations();

function getDestinationHtml(destination, index) {
  if (filter && filter != destination.status) {
    return '';
  }
  let checked = destination.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="destination">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${destination.name}</span>
      </label>
      <button class="delete-button" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `; 
}

function showDestinations() {
  if (destinationsJson.length == 0) {
    destinationsHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    destinationsHtml.innerHTML = destinationsJson.map(getDestinationHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addDestination(destination)  {
  input.value = "";
  destinationsJson.unshift({ name: destination, status: "pending" });
  localStorage.setItem("destinations", JSON.stringify(destinationsJson));
  showDestinations();
}

input.addEventListener("keyup", e => {
  let destination = input.value.trim();
  if (!destination || e.key != "Enter") {
    return;
  }
  addDestination(destination);
});

addButton.addEventListener("click", () => {
  let destination = input.value.trim();
  if (!destination) {
    return;
  }
  addDestination(destination);
});

function updateStatus(destination) {
  let destinationName = destination.parentElement.lastElementChild;
  if (destination.checked) {
    destinationName.classList.add("checked");
    destinationsJson[destination.id].status = "completed";
  } else {
    destinationName.classList.remove("checked");
    destinationsJson[destination.id].status = "pending";
  }
  localStorage.setItem("destinations", JSON.stringify(destinationsJson));
}

function remove(destination) {
  const index = destination.dataset.index;
  destinationsJson.splice(index, 1);
  showDestinations();
  localStorage.setItem("destinations", JSON.stringify(destinationsJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showDestinations();
  });
});

deleteAllButton.addEventListener("click", () => {
  destinationsJson = [];
  localStorage.setItem("destinations", JSON.stringify(destinationsJson));
  showDestinations();
});