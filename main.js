//import GameImages from './images4.js'
//const gameImages = new GameImages()

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')
let audio = new Audio("/game/media/audio/spear-shot.mp3")

let spear = {distance:1500, time:500}
let speed = spear.distance / spear.time * 5
let distanceCovered = 0

let metricCentre = {x: 0, y: 0}
let rotate = 0
let oldRotate = undefined
let lOffset = 30
let rOffset = 30
let endOfAnimation = false
let animation = false
const mousePos = {
    x: 0,
    y: 0
};

const playerState = {
    mouseIsDown: false
}

let scale = 1

function canvasUpdateSize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    metricCentre.x = canvas.width / 2;
    metricCentre.y = canvas.height / 2;
}

window.addEventListener("resize", canvasUpdateSize)
canvasUpdateSize()

canvas.addEventListener("mousedown", () => playerState.isMouseDown = true)
canvas.addEventListener("mousemove", (event) => {
    mousePos.x = event.offsetX
    mousePos.y = event.offsetY
    rotate = getAngle(metricCentre, mousePos);
})
canvas.addEventListener("wheel", (event) => {
    scale = scale + scale * event.deltaY / 900
})

const pointCentre = {x: 0, y: 0}

pointCentre.x = canvas.width / 2;
pointCentre.y = canvas.height / 2;

function getAngle(centre, point) {
    const deltaX = point.x - centre.x;
    const deltaY = point.y - centre.y;

    const angleCalc = Math.round(Math.atan(deltaY / deltaX) * (180 / Math.PI));

    if (deltaX >= 0 && deltaY >= 0) return angleCalc
    if (deltaX < 0 && deltaY >= 0) return 180 + angleCalc
    if (deltaX < 0 && deltaY < 0) return 180 + angleCalc
    if (deltaX > 0 && deltaY < 0) return 360 + angleCalc
    return angleCalc;
}

draw()

function draw() {

    window.requestAnimationFrame(draw)

    //if (!gameImages.loaded) return

    const imgMan = new Image()
    imgMan.src = "img/day-skin0.png"

    const handLeft = new Image()
    handLeft.src = "img/day-left-arm0.png"

    const handRight = new Image()
    handRight.src = "img/day-right-arm0.png"
    const spearBullet = new Image()
    spearBullet.src = "img/night-ground-wood-spear.png"

    ctx.reset()
    ctx.save()
    ctx.translate(metricCentre.x, metricCentre.y)
    ctx.scale(scale, scale)
    ctx.rotate(rotate * Math.PI / 180)
    ctx.drawImage(handLeft, -61 / 60 + lOffset, -178 / 2 - 25)
    ctx.drawImage(handRight, -61 / 60 - rOffset, 178 / 2 - 35)
    ctx.drawImage(imgMan, -178 / 2, -178 / 2)
    ctx.restore()




    ctx.translate(metricCentre.x, metricCentre.y)
    ctx.scale(scale,scale)
    if (playerState.isMouseDown ){

        if (!endOfAnimation && !animation) rOffset += 0.8
        if (!endOfAnimation && rOffset > 70) animation = true
        if (!endOfAnimation && animation) rOffset -= 6

        if (!endOfAnimation && rOffset <= 0){
            oldRotate = rotate * Math.PI / 180
            endOfAnimation = true
            rOffset = 0
            audio.play()
        }
        if (endOfAnimation){
            distanceCovered += speed
            lOffset -= 2
            lOffset = Math.max(lOffset,0)
        }

    }

    if (distanceCovered < spear.distance){
        if (oldRotate === undefined) ctx.rotate(rotate * Math.PI / 180)
        else ctx.rotate(oldRotate)
        ctx.rotate(90*Math.PI/180)
        ctx.drawImage(spearBullet, 60, -180 + rOffset - distanceCovered)
    }
    if (distanceCovered > spear.distance){
        lOffset = 30
        oldRotate = undefined
        distanceCovered = 0
        playerState.isMouseDown = false
        endOfAnimation = false
        animation = false

    }



}