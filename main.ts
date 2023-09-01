function ZeichneSonarRadius () {
    OLED12864_I2C.clear()
    OLED12864_I2C.circle(
    Mittelpunkt_X,
    Mittelpunkt_Y,
    Radius,
    1
    )
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    Abtasten = !(Abtasten)
    if (Abtasten) {
        radio.sendValue("A", 1)
    } else {
        radio.sendValue("A", 0)
    }
})
function ZeichneSonar () {
    if (Winkel == 0 || Winkel == 180) {
        ZeichneSonarRadius()
    }
    EntfernungPixel = Math.ceil(Strahl * EntfernungCM / EntfernungCMMax)
    OLED12864_I2C.showNumber(
    22,
    0,
    EntfernungCMMax,
    1
    )
    OLED12864_I2C.showNumber(
    0,
    0,
    EntfernungCM,
    1
    )
    OLED12864_I2C.radius_line(
    Mittelpunkt_X,
    Mittelpunkt_Y,
    Strahl,
    Winkel,
    1
    )
    OLED12864_I2C.radius_line(
    Mittelpunkt_X,
    Mittelpunkt_Y,
    Strahl,
    Winkel,
    0
    )
    if (EntfernungPixel > 0) {
        OLED12864_I2C.radius_circle(
        Mittelpunkt_X,
        Mittelpunkt_Y,
        EntfernungPixel,
        Winkel,
        2,
        1
        )
    }
}
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    Fahren = !(Fahren)
    if (Fahren) {
        basic.setLedColor(0x00ff00)
    } else {
        basic.turnRgbLedOff()
    }
})
radio.onReceivedValue(function (name, value) {
    if (name == "EMAX") {
        EntfernungCMMax = value
    } else if (name == "W") {
        Winkel = value
    } else if (name == "E") {
        EntfernungCM = value
        ZeichneSonar()
    } else {
    	
    }
})
let MotorRechts = 0
let MotorLinks = 0
let BremseRechts = 0
let BremseLinks = 0
let Geschwindigkeit = 0
let LedY = 0
let LedX = 0
let NeigungY = 0
let NeigungX = 0
let EntfernungPixel = 0
let Radius = 0
let Strahl = 0
let Mittelpunkt_Y = 0
let Mittelpunkt_X = 0
let Fahren = false
let Abtasten = false
let EntfernungCM = 0
let Winkel = 0
let EntfernungCMMax = 0
OLED12864_I2C.init(60)
OLED12864_I2C.zoom(false)
let NeigungMax = 30
let MotorMinimum = 70
EntfernungCMMax = 0
Winkel = 0
EntfernungCM = 0
radio.setGroup(1)
basic.turnRgbLedOff()
Abtasten = false
Fahren = false
Mittelpunkt_X = 64
Mittelpunkt_Y = 64
Strahl = 62
Radius = Strahl + 2
ZeichneSonarRadius()
basic.forever(function () {
    if (Fahren) {
        NeigungX = input.rotation(Rotation.Roll)
        NeigungY = input.rotation(Rotation.Pitch)
        NeigungX = Math.constrain(NeigungX, NeigungMax * -1, NeigungMax)
        NeigungY = Math.constrain(NeigungY, NeigungMax * -1, NeigungMax)
        led.unplot(LedX, LedY)
        LedX = Math.map(NeigungX, NeigungMax * -1, NeigungMax, 0, 4)
        LedY = Math.map(NeigungY, NeigungMax * -1, NeigungMax, 0, 4)
        led.plot(LedX, LedY)
        Geschwindigkeit = Math.map(NeigungY, NeigungMax * -1, NeigungMax, 100, MotorMinimum)
        if (NeigungX < 0) {
            BremseLinks = Math.map(NeigungX, 0, NeigungMax * -1, 0, Geschwindigkeit - MotorMinimum)
        } else {
            BremseLinks = 0
        }
        if (NeigungX > 0) {
            BremseRechts = Math.map(NeigungX, 0, NeigungMax, 0, Geschwindigkeit - MotorMinimum)
        } else {
            BremseRechts = 0
        }
        MotorLinks = Geschwindigkeit - BremseLinks
        MotorRechts = Geschwindigkeit - BremseRechts
        radio.sendValue("F", 1)
        radio.sendValue("R", MotorRechts)
        radio.sendValue("L", MotorLinks)
        radio.sendValue("X", LedX)
        radio.sendValue("Y", LedY)
        basic.pause(50)
    } else {
        radio.sendValue("F", 0)
        basic.clearScreen()
    }
})
