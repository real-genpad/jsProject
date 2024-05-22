import {Main} from "./components/main";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";
import {IncomeAndExpenses} from "./components/income-expenses/income-expenses";
import {IncomeAndExpensesCreate} from "./components/income-expenses/income-expenses-create";
import {IncomeAndExpensesEdit} from "./components/income-expenses/income-expenses-edit";
import {Income} from "./components/income/income";
import {IncomeEdit} from "./components/income/income-edit";
import {IncomeCreate} from "./components/income/income-create";
import {Expenses} from "./components/expenses/expenses";
import {ExpensesEdit} from "./components/expenses/expenses-edit";
import {ExpensesCreate} from "./components/expenses/expenses-create";

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
                load: () => {
                    new Main();
                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'vh-100');
                    new Login();
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
                load: () => {
                    document.body.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'vh-100');
                    new SignUp();
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
                load: () => {
                    new IncomeAndExpenses();
                },
            },
            {
                route: '/income-and-expenses-create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-and-expenses/income-expenses-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeAndExpensesCreate();
                },
            },
            {
                route: '/income-and-expenses-edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/income-and-expenses/income-expenses-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeAndExpensesEdit();
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income();
                },
            },
            {
                route: '/income-edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/income/income-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit();
                },
            },
            {
                route: '/income-create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/income/income-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate();
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/expenses/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses();
                },
            },
            {
                route: '/expenses-edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/expenses/expenses-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesEdit();
                },
            },
            {
                route: '/expenses-create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/expenses/expenses-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesCreate();
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRout.bind(this));
        window.addEventListener('popstate', this.activateRout.bind(this));
        document.addEventListener('click', this.openNewRoute.bind(this)); //переход по страницам без пересборки приложения
    }

    async openNewRoute(e){

        let element = null;
        if(e.target.nodeName === 'A'){
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A'){
            element = e.target.parentNode;
        }

        if(element){
            e.preventDefault();
            const url = element.href.replace(window.location.origin, '');
            if(!url || url === '/#' || url.startsWith('javascript:void(0)')){
                return
            }
            const currentRoute = window.location.pathname;
            history.pushState({}, '', url);
            await this.activateRout(null, currentRoute);
        }
    }

    async activateRout(e, oldRoute = null) {
        if(oldRoute){
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
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
}