import {Main} from "./components/main";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";
import {IncomeAndExpenses} from "./components/income-expenses/income-expenses";
import {IncomeAndExpensesCreate} from "./components/income-expenses/income-expenses-create";
import {IncomeAndExpensesEdit} from "./components/income-expenses/income-expenses-edit";
import {Logout} from "./components/logout";
import {IncomeAndExpensesDelete} from "./components/income-expenses/income-expenses-delete";
import {AuthUtils} from "./utils/auth-utils";
import {HttpUtils} from "./utils/http-utils";
import {CreateCategory} from "./components/category/create-category";
import {Category} from "./components/category/category";
import {EditCategory} from "./components/category/edit-category";
import {DeleteCategory} from "./components/category/delete-category";

export class Router {
    constructor() {
        this.initEvents();
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Main(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                requiresAuth: false,
                load: () => {
                    document.body.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'vh-100');
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('d-flex', 'justify-content-center', 'align-items-center', 'vh-100');
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                requiresAuth: false,
                load: () => {
                    document.body.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'vh-100');
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('d-flex', 'justify-content-center', 'align-items-center', 'vh-100');
                }
            },
            {
                route: '/income-and-expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/income-and-expenses/income-expenses.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new IncomeAndExpenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-and-expenses-create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-and-expenses/income-expenses-create.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new IncomeAndExpensesCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-and-expenses-edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/income-and-expenses/income-expenses-edit.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new IncomeAndExpensesEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-and-expenses-delete',
                requiresAuth: false,
                load: () => {
                    new IncomeAndExpensesDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/category/category.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Category(this.openNewRoute.bind(this), 'income');
                },
            },
            {
                route: '/income-edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/category/edit-category.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new EditCategory(this.openNewRoute.bind(this), 'income');
                },
            },
            {
                route: '/income-create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/category/create-category.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new CreateCategory(this.openNewRoute.bind(this), 'income');
                },
            },
            {
                route: '/income-delete',
                requiresAuth: false,
                load: () => {
                    new DeleteCategory(this.openNewRoute.bind(this), 'income');
                },
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/category/category.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Category(this.openNewRoute.bind(this), 'expense');
                },
            },
            {
                route: '/expense-edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/category/edit-category.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new EditCategory(this.openNewRoute.bind(this), 'expense');
                },
            },
            {
                route: '/expense-create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/category/create-category.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new CreateCategory(this.openNewRoute.bind(this), 'expense');
                },
            },
            {
                route: '/expense-delete',
                requiresAuth: false,
                load: () => {
                    new DeleteCategory(this.openNewRoute.bind(this), 'expense');
                },
            },
            {
                route: '/logout',
                requiresAuth: false,
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            }
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRout.bind(this));
        window.addEventListener('popstate', this.activateRout.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this)); //переход по страницам без пересборки приложения
    }

    async openNewRoute(url) { //переходим на новую страницу, неважно это клик по ссылке от пользователя
        // или принудительный перевод
        //5.вызываем нужные действия, чтобы сменить страницу
        const currentRoute = window.location.pathname; //берем текущий роут
        history.pushState({}, '', url); //изменяем url-адрес в браузере
        await this.activateRout(null, currentRoute); //вызываем ф-цию activateRout с текущим роутом
    }

    async clickHandler(e) { //обрабатываем клик по ссылке
        //1.ищем элемент
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        //2.обрабатываем клик по элементу
        //3.если элемент нашелся
        if (element) {
            e.preventDefault();
            //4.берем из него url-адрес
            const url = element.href.replace(window.location.origin, '');
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRout(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.requiresAuth && !this.isAuthenticated()) {
                return this.openNewRoute('/login');
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) { //если на странице есть сайдбар, наполняем его данными и подсвечиваем ссылки
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');

                    //находим элементы для сайдбара
                    this.profileNameElement = document.getElementById('profile-name');
                    this.profileNameElementMenu = document.getElementById('profile-name-menu');
                    this.balanceElement = document.getElementById('balance');
                    this.balanceElementMenu = document.getElementById('balance-menu');
                    this.modal = document.getElementById("customModal");
                    const balanceLink = document.getElementById("balance-link");
                    const confirmBalanceBtn = document.getElementById("confirm-balance-btn");
                    const cancelBalanceBtn = document.getElementById("cancel-balance-btn");
                    this.balanceInput = document.getElementById("edit-balance");

                    //вставляем имя пользователя
                    if (this.profileNameElement.innerText === '' || this.profileNameElementMenu.innerText === '') {
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                        if (userInfo) {
                            userInfo = JSON.parse(userInfo);
                            if (userInfo.name) {
                                this.profileNameElement.innerText = userInfo.name;
                                this.profileNameElementMenu.innerText = userInfo.name;
                            }
                        }
                    }
                    this.activateMenuItem(newRoute); //подсвечиваем активные ссылки
                    this.showBalance().then(); //показываем баланс

                    // открываем модальне окно при нажатии на ссылку "Баланс"
                    // balanceLink.addEventListener("click", () => {
                    //     this.modal.style.display = "block";
                    // });
                    //закрываем модальное окно при нажатии на кнопку "Отменить"
                    // cancelBalanceBtn.addEventListener("click", () => {
                    //     this.balanceInput.value = ''; // Сбросить значение инпута
                    //     this.modal.style.display = "none";
                    // });
                    //обновляем баланс
                    //confirmBalanceBtn.addEventListener('click', this.editBalance.bind(this));

                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('requested route was not found');
            history.pushState({}, '', '/');
            await this.activateRout();
        }
    }

    isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    }

    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link, .navbar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        })
    }

    async showBalance() {
        const result = await HttpUtils.request('/balance');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе баланса');
        }
        if (this.balanceElement.innerText === '' || this.balanceElementMenu.innerText === '') {
            if (result.response.balance) {
                this.balanceElement.innerText = result.response.balance;
                this.balanceElementMenu.innerText = result.response.balance;
            }
        }
    }

    async editBalance() {
        const result = await HttpUtils.request('/balance', 'PUT', true, {
            newBalance: this.balanceInput.value
        });
        if (result.redirect) {
            this.modal.style.display = "none";
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            this.modal.style.display = "none";
            return alert('Возникла ошибка при обновлении баланса');
        }
        if (result.response.balance) {
            this.balanceElement.innerText = result.response.balance;
            this.balanceElementMenu.innerText = result.response.balance;
            this.modal.style.display = "none";
        }
    }
}