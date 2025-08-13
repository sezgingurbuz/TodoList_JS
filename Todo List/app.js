
const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#clearButton");
const filterInput = document.querySelector("#todoSearch");

let todos = [];


runEvents();
function runEvents() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", pageLoaded);
    secondCardBody.addEventListener("click", removeTodoToUI);
    todoClearButton.addEventListener("click", allTodosClear);
    filterInput.addEventListener("keyup", filter); //Klavyeden çekildiğinde devreye gir ve filter fonksiyonunu çalıştır.

}

function pageLoaded() {
    //Bu fonksiyonda sayfa yüklendiği anda arka planda yapılması gereken işlemleri çalıştırıyoruz.
    //Alttaki örnekte sayfa yüklendiğinde storage'daki değerlerin forma dolması için gerekli kodlar vardır.
    checkTodosFromStorage();
    todos.forEach(function (todo) {
        addTodoUI(todo);

    });


}

function filter(e) {
    //Bu fonksiyon altında Todo'ları filtreleme işlemi yapılmaktadır.

    const filterValue = e.target.value.toLowerCase();
    const todoListesi = document.querySelectorAll(".list-group-item");

    if (todoListesi.length > 0) {
        todoListesi.forEach(function (todo) {
            if (todo.textContent.toLowerCase().trim().includes(filterValue)) //todo'ları küçük metne çevir, boşlukları kaldır ve filtrenen kelimeye sahip mi kontrol et
            {
                todo.setAttribute("style", "display: block");
            }
            else {
                todo.setAttribute("style", "display : none !important");
            }
        });
    }

}


function allTodosClear() {

    //UI temizleme
    const todoList = document.querySelectorAll(".list-group-item");
    if (todoList.length > 0) {
        //TodoListesinde en az bir tane öğe varsa
        todoList.forEach(function (todo) {
            todo.remove();
        });
    }
    else {
        //Todo listesi boşsa
        showAlert("warning", "Silmek için en az bir todo olmalıdır.");
    }

    //Storage temizleme
    todos = [];
    localStorage.setItem("todos", JSON.stringify(todos));
    showAlert("success", "Başarılı bir şekilde temizlendi.");
}

function addTodo(e) {
    const inputText = addInput.value.trim(); // Trim metnin başındaki ve sonundaki boşlukları siler. 
    if (inputText == null || inputText == "") {
        showAlert("warning", "Lütfen boş bırakmayınız!"); //Eğer ekleme başarısızsa sarı renkte bir uyarı mesajı çıkar.
    }
    else {
        addTodoUI(inputText); //Arayüze ekle
        addTodoStorage(inputText); //Storage'a ekle.
        showAlert("success", "Todo eklendi."); //Eğer ekleme başarılıysa success yani yeşil renkte uyarı çıkar.


    }

    e.preventDefault(); //Farklı bir sayfaya yönlendirmesini engelleme

}
function addTodoUI(newTodo) {

    //Arayüze ekleme Fonksiyonu. Girilen todo site üzerine liste içine eklenir.

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.textContent = newTodo;

    const a = document.createElement("a");
    a.className = "delete-item";
    a.href = "#";

    const i = document.createElement("i");
    i.className = "fa fa-remove";

    a.appendChild(i); //i'yi a'nın içine attık.
    li.appendChild(a); //a'yı li'nin içine attık.
    todoList.appendChild(li); //li'yi todoList içine al.

    addInput.value = ""; //Ekleme işi bittikten sonra input'u temizle.




}


function addTodoStorage(newTodo) {
    //Burada todolar storage'da var mı kontrolü sağlanır ve ardından storage'a eklenir.
    checkTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));

}

function checkTodosFromStorage() {
    //Burada localstorage'da daha önce eklenmiş başka todo var mı kontrolü yapılır.
    // Eğer hiç todo yoksa, boş bir todo dizisi oluşturulur.
    //Eğer varsa localstorage'dan okunup todos adlı değişkene yüklenir.
    if (localStorage.getItem("todos") == null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
}

function showAlert(type, message) {
    // <div class="alert alert-success" role="alert" style="margin-top: 20px">
    //     A simple success alert—check it out!
    // </div>
    //Burada listeye todo ekledikten sonra submit butonun altında bir uyarı mesajı çıkarıyoruz.


    const div = document.createElement("div");
    div.className = "alert alert-" + type;
    div.role = "alert";
    div.style = "margin-top: 30px";
    div.textContent = message;

    firstCardBody.appendChild(div); //first card body'nin içerisine bu oluşturduğum div'i ekle.

    setTimeout(function () {
        div.remove();
    }, 2500);

}

function removeTodoToUI(e) {
    // Burada todo'yu önce UI'dan sonrasında storage'dan silme işlemleri yapılıyor.
    if (e.target.className == "fa fa-remove") {
        const todoElement = e.target.parentElement.parentElement;
        const todoText = todoElement.firstChild.textContent.trim();

        // UI'dan sil
        todoElement.remove();

        // Storage'dan sil
        removeTodoToStorage(todoText);

        showAlert("success", "Todo başarıyla kaldırıldı.");
    }
}

function removeTodoToStorage(removeTodoText) {
    checkTodosFromStorage(); // todos dizisini storage'dan çek

    todos.forEach(function (todo, index) {
        if (todo === removeTodoText) {
            todos.splice(index, 1); // indeksten başlayarak 1 eleman sil
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}
