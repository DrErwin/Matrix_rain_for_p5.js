<!--
 * @Author: Yuhong Wu
 * @Date: 2024-05-06 21:24:51
 * @LastEditors: Yuhong Wu
 * @LastEditTime: 2024-05-06 23:53:28
 * @Description: 
-->
# About the project

This is an implementation of 
- Visual effect of 'raining code' in the movie *Matrix*

![](./resources/Matrix_rain.gif)

- A mask of human figure to do human-computer interaction(HCI) with Microsoft Kinect v2

![](./resources/Matrix_rain_mask.gif)

This project is written in **javascript**, specifically **p5.js**, a powerful visualization library for designer and artists. 

The origin code of raining code effect was from [dman1716 in Openprocessing](https://openprocessing.org/sketch/491851)

# Files in the project
- `p5js/Matrix_Kinect` Code of Matrix rain + HCI (read the following chapter to learn how to setup)
- `p5js/Matrix_rain` Modified matrix rain effect
- `p5js/Matrix_rain(origin)` Origin code of matrix rain effect
- `kinectron-app.js` Used for setting up HCI

If you don't need figure mask, just use `p5js/Matrix_rain` or `p5js/Matrix_rain(origin)`

# Kinect HCI Setup
1. Download [Kinectron](https://kinectron.github.io/), follow its guide to download Windows Kinect SDK and set up Kinect.

2. Replace `Kinect-server-0.3.7\resources\app\kinectron-app.js` with the file in this project

---
***Don't use `kinectron-client.js` from kinectron! There were some bugs. Just use the file in the project.***

***Your p5js version should be no more than 0.9.0 !***

If you find the canvas is flashing, that's mainly because FPS meet hardware limitations. You can either decrease the amount of symbols or set a lower `frameRate()`.

---

# What was modified in `kinectron-app.js`?

1. The transmission port of `peer` was modfied to 9001, in accordance with `kinectron-client.js`

2. Enabled `willReadFrequently` attribution of `context` when set up, for quick loading of image pixels

3. Modified `startKey()` to support multi-person Key images
