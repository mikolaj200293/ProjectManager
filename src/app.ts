interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatable: Validatable) {
    let isValid = true;
    if (validatable.required) {
        isValid = isValid && validatable.value.toString().trim().length !== 0;
    }
    if (validatable.minLength != null && typeof validatable.value === 'string') {
        isValid = isValid && validatable.value.trim().length >= validatable.minLength;
    }
    if (validatable.maxLength != null && typeof validatable.value === 'string') {
        isValid = isValid && validatable.value.trim().length <= validatable.maxLength;
    }
    if (validatable.min != null && typeof validatable.value === 'number') {
        isValid = isValid && validatable.value >= validatable.min;
    }
    if (validatable.max != null && typeof validatable.value === 'number') {
        isValid = isValid && validatable.value <= validatable.max;
    }
    return isValid;
}

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get(): any {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        },
    };
    return adjDescriptor;
}

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInput: HTMLInputElement;
    descriptionInput: HTMLTextAreaElement;
    peopleInput: HTMLInputElement;
    submitButton: HTMLButtonElement;
    
    
    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;
        const importedHTMLContent = document.importNode(this.templateElement.content, true);
        this.element = <HTMLFormElement>importedHTMLContent.firstElementChild;
        this.element.id = 'user-input';
        this.titleInput = <HTMLInputElement>this.element.querySelector('input[id="title"]')!;
        this.descriptionInput = <HTMLTextAreaElement>this.element.querySelector('textarea[id="description"]')!;
        this.peopleInput = <HTMLInputElement>this.element.querySelector('input[id="people"]')!;
        this.submitButton = <HTMLButtonElement>this.element.querySelector('button[type="submit"]')!;
        this.configure();
        this.attach();
    }
    
    
    private gatherUserInput(): [string, string, number] | void {
        const title: string = this.titleInput.value;
        const description: string = this.descriptionInput.value;
        const people: number = +this.peopleInput.value;
        const titleValidator: Validatable = { value: title, required: true, minLength: 3, maxLength: 100 };
        const descriptionValidator: Validatable = { value: description, required: true, minLength: 10, maxLength: 500 };
        const peopleValidator: Validatable = { value: people, required: true, min: 1, max: 10 };
        if (!validate(titleValidator) || !validate(descriptionValidator) || !validate(peopleValidator)) {
            alert('Wrong input value, please try again.');
            return;
        } else {
            return [title, description, people];
        }
    }
    
    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const formData = this.gatherUserInput();
        if (Array.isArray(formData)) {
            const [title, description, people] = formData;
            console.log(title, description, people);
            this.clearInputs();
        }
    }
    
    private clearInputs() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }
    
    
    private configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const projectInput = new ProjectInput();