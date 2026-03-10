addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block);
        });

    document.getElementById('complexAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('complexAnimationBlock');
            animaster()
            .addMove(200, {x: 40, y: 40})
            .addScale(800, 1.3)
            .addMove(200, {x: 80, y: 0})
            .addScale(800, 1)
            .addMove(200, {x: 40, y: -40})
            .addScale(800, 0.7)
            .addMove(200, {x: 0, y: 0})
            .addScale(800, 1.5)
            .play(block);
        });
}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
    }
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
    }
    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = getTransform({ x: 0, y: 0 }, 1);
    }
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }
    return {
        _steps: [],
        play(element) {
            let delay = 0;
            for (const struct of this._steps) {
                setTimeout(() => struct.f(element), delay);
                delay += struct.duration;
            }
            setTimeout(() => resetMoveAndScale(element), delay);
        },
        addMove(duration, translation) {
            this._steps.push({
                f: el => move(el, duration, translation),
                duration: duration,
            });
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push({
                f: el => this.scale(el, duration, ratio),
                duration: duration,
            });
            return this;
        },
        addFadeIn(duration) {
            this._steps.push({
                f: el => this.fadeIn(el, duration),
                duration: duration,
            });
            return this;
        },
        addFadeOut(duration) {
            this._steps.push({
                f: el => this.fadeOut(el, duration),
                duration: duration,
            });
            return this;
        },
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        move(element, duration, translation) {
            this.addMove(duration, translation).play(element);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        moveAndHide(element, duration) {
            this.move(element, duration * 2 / 5, {x: 100, y: 20});
            this.fadeOut(element, duration * 3 / 5);
        },
        showAndHide(element, duration) {
            this.fadeIn(element, duration * 1 / 3);
            setTimeout(() => this.fadeOut(element, duration * 1 / 3), duration * 1 / 3);
        },
        heartBeating(element) {
            setInterval(() => {
                this.scale(element, 500, 1.4);
                setTimeout(() => this.scale(element, 500, 1), 500);
            }, 1000);
        }
    }
}


function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
