const config = {
    hiddenLayers: [3]
}

const net = new brain.NeuralNetwork()

const data = [
    {"input":{"r":0,"g":0,"b":0},"output":[1]},{"input":{"r":1,"g":1,"b":1},"output":[0]},{"input":{"r":0.29431980957084547,"g":0.8904399311807758,"b":0.8855467187680754},"output":[0]},{"input":{"r":0.258244545833346,"g":0.5432300771318523,"b":0.5165139796287612},"output":[1]},{"input":{"r":0.8477967782570262,"g":0.9316882731805476,"b":0.9886938084695815},"output":[0]},{"input":{"r":0.016433726845428653,"g":0.138564688310997,"b":0.7741839743630545},"output":[1]},{"input":{"r":0.8832097087623147,"g":0.9265156728703263,"b":0.09883297532940172},"output":[0]},{"input":{"r":0.13361595118819136,"g":0.7565603232147549,"b":0.5083506562414},"output":[0]},{"input":{"r":0.08793071892462812,"g":0.5535642025493817,"b":0.19431575133446044},"output":[1]},{"input":{"r":0.001238910644361102,"g":0.2057431960785352,"b":0.9970549101785804},"output":[1]},{"input":{"r":0.05204925256492654,"g":0.7134419999961183,"b":0.6061743650813622},"output":[0]},{"input":{"r":0.23170662990590074,"g":0.40662858281485925,"b":0.2420571366068518},"output":[1]},{"input":{"r":0.9218007019166008,"g":0.1963462700650873,"b":0.32390481761035117},"output":[1]},{"input":{"r":0.19982091503257648,"g":0.4337325164910002,"b":0.9673829877431919},"output":[1]},{"input":{"r":0.8273297899374916,"g":0.7331182508500758,"b":0.7187009898966326},"output":[0]},{"input":{"r":0.06724275527766621,"g":0.24646241675215075,"b":0.2287131644009024},"output":[1]},{"input":{"r":0.9771547316087643,"g":0.3656370179673907,"b":0.7614074225264726},"output":[0]},{"input":{"r":0.6051483180394004,"g":0.12098303761748075,"b":0.8888702875348811},"output":[1]},{"input":{"r":0.8944850823227575,"g":0.828093627722492,"b":0.8060684173168262},"output":[0]},{"input":{"r":0.26704065221433404,"g":0.9131600129224364,"b":0.29083739590006474},"output":[0]},{"input":{"r":0.403127523378368,"g":0.10694613594347802,"b":0.10558455033633862},"output":[1]},{"input":{"r":0.11659981205270253,"g":0.3959311710302085,"b":0.7114801176966326},"output":[1]},{"input":{"r":0.012264110315111099,"g":0.7250921785012894,"b":0.25689959315138267},"output":[0]},{"input":{"r":0.16952715219999304,"g":0.22383526895916117,"b":0.9419047697661529},"output":[1]},{"input":{"r":0.5676341472389186,"g":0.33202376428994995,"b":0.6917760915669429},"output":[1]},{"input":{"r":0.025327311646986983,"g":0.07336540784250056,"b":0.28881160791989946},"output":[1]},{"input":{"r":0.3683432365870549,"g":0.9708872955091767,"b":0.7411608823954674},"output":[0]},{"input":{"r":0.5707458067571376,"g":0.929561109441223,"b":0.9629393263764778},"output":[0]},{"input":{"r":0.24589969475303053,"g":0.8764906116151481,"b":0.07475028079399904},"output":[0]},{"input":{"r":0.7302924737876919,"g":0.8492910194869492,"b":0.12286907290986049},"output":[0]},{"input":{"r":0.9422873515407522,"g":0.4212815191504724,"b":0.17628320667436537},"output":[0]},{"input":{"r":0.04431930819077601,"g":0.3557513344184158,"b":0.6328853305002133},"output":[1]},{"input":{"r":0.0014353959271338201,"g":0.7148789266808184,"b":0.6689450873017817},"output":[0]},{"input":{"r":0.7229877287318616,"g":0.10709500743695588,"b":0.4942843750870327},"output":[1]}
]

net.train(data)

const colorEl = $("#color")
const guessEl = $("#guess")
const whiteButton = $("#white-button")
const blackButton = $("#black-button")
const printButton = $("#print-button")
let color
setRandomColor()

$(whiteButton).on("click", () => {
    chooseColor(1)
})

$(blackButton).on("click", () => {
    chooseColor(0)
})

$(printButton).on("click", () => {
    print()
})

function chooseColor(value) {
    data.push({
        input: color,
        output: [value]
    })
    setRandomColor()
}

function print() {
    console.log(JSON.stringify(data))
}

function setRandomColor() {
    color = {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    }
    const guess = net.run(color)[0]
    $(guessEl).css("color", guess > .5 ? "#FFF" : "#000")
    $(colorEl).css("background-color", `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`)
}