function newElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier')

    const barrierBorder = newElement('div', 'barrier-border')
    const barrierBody = newElement('div', 'barrier-body')
    this.element.appendChild(reverse ? barrierBody : barrierBorder)
    this.element.appendChild(reverse ? barrierBorder : barrierBody)

    this.setHeight = height => barrierBody.style.height = `${height}px`
}

function PairOfBarriers(height, slit, x) {
    this.element = newElement('div', 'pair-of-barriers')

    this.above = new Barrier(true)
    this.below = new Barrier(false)

    this.element.appendChild(this.above.element)
    this.element.appendChild(this.below.element)

    this.raffleSlit = () => {
        const topHeight = Math.random() * (height - slit)
        const bottonheight = height - slit - topHeight
        this.above.setHeight(topHeight)
        this.below.setHeight(bottonheight)

    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getwidth = () => this.element.clientWidth

    this.raffleSlit()
    this.setX(x)
}

function Barriers(height, width, aperture, space, notifyPoint) {
    this.pairs = [
        new PairOfBarriers(height, aperture, width),
        new PairOfBarriers(height, aperture, width + space),
        new PairOfBarriers(height, aperture, width + space * 2),
        new PairOfBarriers(height, aperture, width + space * 3)
    ]

    const displacement = 3
    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - displacement)

            if (pair.getX() < -pair.getwidth()) {
                pair.setX(pair.getX() + space * this.pairs.length)
                pair.raffleSlit()
            }

            const mid = width / 2
            const xmid = pair.getX() + displacement >= mid && pair.getX() < mid
            if (xmid) notifyPoint()
        })
    }
}

function Bird(gameHeight) {
    let fly = false

    this.element = newElement('img', 'bird')
    this.element.src = 'passaro.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => fly = true
    window.onkeyup = e => fly = false

    this.animate = () => {
        const newY = this.getY() + (fly ? 8 : -5)
        const maxHeight = gameHeight - this.element.clientHeight

        if (newY <= 0) {
            this.setY(0)
        } else if (newY >= maxHeight) {
            this.setY(maxHeight)
        } else {
            this.setY(newY)
        }
    }

    this.setY(gameHeight / 2)
}



function Progress() {
    this.element = newElement('span', 'progress')
    this.pointUpdate = points => {
        this.element.innerHTML = points
    }
    this.pointUpdate(0)
}

function overlapping(elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertial = a.top + a.height >= b.top && + b.height >= a.top
    return horizontal && vertial
}

function collision(bird, barriers) {
    let collision = false
    barriers.pairs.forEach(PairOfBarriers => {
        if (!collision) {
            const higher = PairOfBarriers.above.element
            const bottom = PairOfBarriers.below.element
            collision = overlapping(bird.element, higher) || overlapping(bird.element, bottom)
        }
    })
    return collision
}

function FlappyBird() {
    let points = 0

    const gameArea = document.querySelector('[wm-flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth

    const progress = new Progress()
    const barriers = new Barriers(height, width, 200, 400, () => progress.pointUpdate(++points))
    const bird = new Bird(height)

    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () => {
        const temp = setInterval(() => {
            barriers.animate()
            bird.animate()

            if (collision(bird, barriers)) {
                clearInterval(temp)
            }
        }, 20)
    }
}

new FlappyBird().start()