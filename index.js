const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const inputFolder = "./images";
const outputFolder = "./watermarked-images";
const watermarkPath = "./watermark-test.png";
const targetWidth = 800;
const targetHeight = 600;
const watermarkSize = 100;

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

async function addWatermark(inputImagePath, outputImagePath, watermarkPath) {
  const image = sharp(inputImagePath).resize(targetWidth, targetHeight);
  const watermark = await sharp(watermarkPath).resize(watermarkSize).toBuffer();

  const { width, height } = await image.metadata();

  const watermarkOptions = {
    input: watermark,
    gravity: "southeast",
  };

  await image.composite([watermarkOptions]).toFile(outputImagePath);
}

fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error("Görseller okunurken hata oluştu:", err);
    return;
  }

  files.forEach((file) => {
    const inputImagePath = path.join(inputFolder, file);
    const outputImagePath = path.join(outputFolder, file);

    addWatermark(inputImagePath, outputImagePath, watermarkPath)
      .then(() => console.log(`Watermark eklendi: ${file}`))
      .catch((err) =>
        console.error(`Watermark eklenirken hata oluştu: ${file}`, err)
      );
  });
});
