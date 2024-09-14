let huntconfig = {
  type: Phaser.AUTO,
  width: deviceWidth,
  height: deviceHeight * (1825 / iphoneHeight),
  backgroundColor: 0x000000,
  parent: "phaser-div",
  mode: Phaser.Scale.FIT,
  dom: {
    createContainer: true,
  },
  fontFamily: ["Arial", "Arial Black"],
  scene: [WordHunts],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

function startHuntGame() {

  document.getElementsByTagName("body")[0].innerHTML = "";
  game = new Phaser.Game(huntconfig);
}