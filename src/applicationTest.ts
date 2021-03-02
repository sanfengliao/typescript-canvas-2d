import { Application, CanvasKeybordEvent, CanvasMouseEvent } from "./application";

class ApplicationTest extends Application {
  dispatchKeyDown(event: CanvasKeybordEvent) {
    console.log(`key: ${event.key} is down`)
  }
  dispatchMouseDown(event: CanvasMouseEvent) {
    console.log(`canvasPosition: ${event.canvasPosition}`)
  }

  update(elaspedTime: number, intervalTime: number) {
    console.log(`elaspedTime: ${elaspedTime}, intervalTime: ${intervalTime}`)
  }

  public render() {
    console.log('调用render方法')
  }
}

export default ApplicationTest;