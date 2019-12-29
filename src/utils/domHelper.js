export function $ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

export function $resize(fn) {
    window.addEventListener('resize', fn);
}

export function $attr(el, attribute, value) {
    if (value) {
        el.setAttribute(attribute, value);
    } else {
        return el.getAttribute(attribute);
    }
}

export function $clone(obj) {
    return Object.assign({}, obj);
}

export function $toggleClass(el, className) {
    if (el.classList) {
        el.classList.toggle(className);

    } else {
        let classes = el.className.split(' ');
        let existingIndex = classes.indexOf(className);

        if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
        else
            classes.push(className);

        el.className = classes.join(' ');
    }
}

export function $hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
}

export function $classes(el) {
    if (el.classList) {
        return el.classList;
    } else {
        return el.className.split(' ');
    }
}

export function $removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}

export function $addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}

export function $removeClassIfExists(el, className) {
    if ($hasClass(el, className)) {
        $removeClass(el, className);
    }
}

export function $addClassIfNotExists(el, className) {
    if (!$hasClass(el, className)) {
        $addClass(el, className);
    }
}

export function $changeClass(el, classToChange, newClassName) {
    $removeClassIfExists(el, classToChange);
    $addClassIfNotExists(el, newClassName);
}

export function $show(el) {
    el.style.display = '';
}

export function $hide(el) {
    el.style.display = 'none';
}

export function $findById(id) {
    return document.getElementById(id);
}

export function $findAllByClass(el, className) {
    return el.getElementsByClassName(className);
}

export function $qs(selector, scope) {
    return (scope || document).querySelector(selector);
}

export function $qsa(selector, scope) {
    return (scope || document).querySelectorAll(selector);
}

export function $on(target, type, callback, capture) {
    target.addEventListener(type, callback, !!capture);
}

export function $delegate(target, selector, type, handler, capture) {
    const dispatchEvent = event => {
        const targetElement = event.target;
        const potentialElements = target.querySelectorAll(selector);
        let i = potentialElements.length;

        while (i--) {
            if (potentialElements[i] === targetElement) {
                handler.call(targetElement, event);
                break;
            }
        }
    };

    $on(target, type, dispatchEvent, !!capture);
}

export function $appendCSS(style) {
    let links = document.getElementsByTagName('link');

    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === style) {
            return;
        }
    }

    let ss = document.createElement('link');
    ss.type = 'text/css';
    ss.rel = 'stylesheet';
    ss.href = style;
    document.getElementsByTagName('head')[0].appendChild(ss);
}

export function $parseHTML(str) {
    let tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return tmp.body.children;
}

export function $newElement(type, classNames) {
    let el = document.createElement(type);

    if (classNames) {
        if (typeof classNames === 'string') {
            classNames = [classNames];
        }

        classNames.forEach(cls => $addClass(el, cls));
    }

    return el;
}

export function $processArray(arr, fn) {
    return arr.reduce(
        (p, v) => p.then((a) => fn(v).then(r => a.concat([r]))),
        Promise.resolve([])
    );
}

export function $elementFromString(str) {
    let div = document.createElement('div');
    div.innerHTML = str.trim();
    return div.firstChild;
}