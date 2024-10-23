window.location = "https://einarkl.no" + location.pathname;
const config = {
    hiddenLayers: [3]
}

//const net = new brain.NeuralNetwork(config)
const net = new brain.NeuralNetwork()

net.train([
    {
        input: [0, 0],
        output:[0]
    },
    {
        input: [1, 0],
        output:[1]
    },
    {
        input: [0, 1],
        output:[1]
    },
    {
        input: [1, 1],
        output:[0]
    }
])

const diagram = $("#diagram");
$(diagram).html(brain.utilities.toSVG(net))

$("#result").text(net.run([1, 0]));