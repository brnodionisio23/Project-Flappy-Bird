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

// const b = new Barrier(false)
// b.setHeight(200)
// document.querySelector('[wm-flappy]').appendChild(b.element)

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

// const b = new PairOfBarriers(700, 200, 400)
// document.querySelector('[wm-flappy]').appendChild(b.element)

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
            const xmid = pair.getX + displacement >= mid && pair.getX < mid
            if (xmid) notifyPoint()
        })
    }
}

const barriers = new Barriers(700, 1200, 200, 400)
const gameArea = document.querySelector('[wm-flappy]')
barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))
setInterval(() => {
    barriers.animate()
}, 20)