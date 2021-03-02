export enum EInputEventType {
  MouseEvent,
  MouseDown,
  MouseUp,
  MouseMove,
  MouseDrag,
  KeybordEvent,
  KeybordUp,
  KeybordDown,
  KeybordPress
}

export class CanvasInputEvent {
  // 是否按下了alt, ctrl, shift
  altKey = false;
  ctrlKey = false;
  shiftKey = false;

  // 当前事件类型
  type = EInputEventType.MouseEvent;

  constructor(altKey = false, ctrlKey = false, shiftKey = false, type = EInputEventType.MouseEvent) {
    this.altKey = altKey;
    this.ctrlKey = ctrlKey;
    this.shiftKey = shiftKey;
    this.type = type;
  }

}

export enum ButtonType {
  Left,
  Center,
  Right
}

class Vec2 {
  x!: number;
  y!: number;
  static create(x: number, y: number): Vec2{

  }
}

export class CanvasMouseEvent extends CanvasInputEvent {
  // 按下鼠标哪个键
  button = ButtonType.Left;
  canvasPosition!: Vec2;
  localPosition!: Vec2;

  constructor(canvasPos: Vec2, button: number, altKey = false, ctrlKey = false, shiftKey = false) {
    super(altKey, ctrlKey, shiftKey);
    this.button = button;
    this.canvasPosition =canvasPos;
  }
  
}

export class CanvasKeybordEvent extends CanvasInputEvent {
  // 按下的键对应的字符
  key!: string;
  // 按下的键对应的ascii吗
  keyCode!: number;

  // 当前按下的键是否不停的触发事件
  repeat!: boolean;

  constructor(key: string, keyCode: number, repeat: boolean, altKey = false, ctrlKey = false, shiftKey = false) {
    super(altKey, ctrlKey, shiftKey, EInputEventType.KeybordEvent);
    this.key = key;
    this.keyCode = keyCode;
    this.repeat = repeat;
  }
}

export interface EventListenerObject {
  handleEvent(event: Event): void;
}

export class Application implements EventListenerObject {
  // 是否进入动画
  protected _started = false;
  // requestAnimationFrame返回的id，用于cancelAnimationFrame取消动画
  protected _requestId = -1;

  // 上一次requestAnimationFrame回调函数调用的时机
  protected _lastTime = -1; 
  // 第一次requestAnimation调用的时机
  protected _startTime = -1;
  protected _isMouseDown!: boolean;
  canvas!: HTMLCanvasElement;

  isSupportMouseEvent!: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    window.addEventListener('keydown', this, false);
    window.addEventListener('keyup', this, false)
    window.addEventListener('keypress', this, false);
    this.canvas.addEventListener('mousedown', this, false);
    this.canvas.addEventListener('mouseup', this, false);
    this.canvas.addEventListener('mousemove', this, false);
    this._isMouseDown = false;
    this.isSupportMouseEvent = false;
  }

  start() {
    if (this._started) {
      return;
    }
    this._started = true;
    this._lastTime = -1;
    this._startTime = -1;
    this._requestId = requestAnimationFrame((time) => {
      this.step(time)
    })
  }

  stop() {
    if (this._started) {
      cancelAnimationFrame(this._requestId);
      this._started = false;
      this._lastTime = -1;
      this._startTime = -1;
    }
  }

  isRunning() {
    return this._started;
  }

  step(time: number) {
    if (this._started) {
      if (this._startTime === -1) {
        this._startTime = time;
      }
      // 记录动画开始到现在的总时间
      const elaspedTime = time - this._startTime;
      // 两次动画之间的间隔
      const intervalTime = time - this._lastTime;
      this._lastTime = time;
      console.log(`elaspedTime = ${elaspedTime}, intervalTime=${intervalTime}`);
      this.update(elaspedTime, intervalTime);
      this.render();
      this._requestId = requestAnimationFrame((time) => {
        this.step(time);
      })
    }
  }
  render() {
    throw new Error("Method not implemented.");
  }
  update(elaspedTime: number, intervalTime: number) {
    throw new Error("Method not implemented.");
  }

  handleEvent(event: Event): void {
    switch(event.type) {
      case 'mousedown': 
        this._isMouseDown = true;
        this.dispathMouseDown(this._toCanvasMouseEvent(event));
        break;
      case 'mouseup':
        this._isMouseDown = false;
        this.dispathMouseUp(this._toCanvasMouseEvent(event));
        break;
      case 'mousemove':
        if (this.isSupportMouseEvent) {
          this.dispatchMouseMove(this._toCanvasMouseEvent(event));
        }
        if (this._isMouseDown) {
          this.dispathMouseDrag(this._toCanvasMouseEvent(event));
        }
        break;
      case 'keypress':
        this.dispathKeyPress(this._toCanvasKeybordEvent(event));
        break;
      case 'keydown':
        this.dispathKeyDown(this._toCanvasKeybordEvent(event));
        break;
      case 'keyup':
        this.dispathKeyUp(this._toCanvasKeybordEvent(event));
        break;
    }
  }
  dispathMouseDown(arg0: CanvasMouseEvent) {
    throw new Error("Method not implemented.");
  }
  dispathMouseUp(arg0: CanvasMouseEvent) {
    throw new Error("Method not implemented.");
  }
  dispatchMouseMove(arg0: CanvasMouseEvent) {
    throw new Error("Method not implemented.");
  }
  dispathMouseDrag(arg0: CanvasMouseEvent) {
    throw new Error("Method not implemented.");
  }
  dispathKeyPress(arg0: CanvasKeybordEvent) {
    throw new Error("Method not implemented.");
  }
  dispathKeyDown(arg0: CanvasKeybordEvent) {
    throw new Error("Method not implemented.");
  }
  dispathKeyUp(arg0: CanvasKeybordEvent) {
    throw new Error("Method not implemented.");
  }

  private _viewportToCanvasCoordinate(event: MouseEvent) {
    if (!this.canvas) {
      console.log('canvas is null');
      throw new Error('canvas is null')
    }
    const rect = this.canvas.getBoundingClientRect();
    if (event.type === 'mousedown') {
      console.log('boundingReact: ', rect);
      console.log('clientX: ', event.clientX, 'clientY: ', event.clientY);
    }
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return Vec2.create(x, y);
  }

  private _toCanvasMouseEvent(e: Event) {
    const event = e as MouseEvent;
    const mousePos = this._viewportToCanvasCoordinate(event);
    const canvasMouseEvent = new CanvasMouseEvent(mousePos, event.button, event.altKey, event.ctrlKey, event.shiftKey)
    return canvasMouseEvent;
  }

  private _toCanvasKeybordEvent(e: Event) {
    const event = e as KeyboardEvent;
    return new CanvasKeybordEvent(event.key, event.keyCode, event.repeat, event.altKey, event.ctrlKey, event.shiftKey);
  }
}

export class Canvas2DApplicaiton extends Application {
  context2D!: CanvasRenderingContext2D | null;
  constructor(canvas: HTMLCanvasElement, contextAttributes: CanvasRenderingContext2DSettings) {
    super(canvas);
    this.context2D = canvas.getContext('2d', contextAttributes);
  }
}

export class WebGLApplication extends Application {
  context3D!: WebGLRenderingContext | null;
  constructor(canvas: HTMLCanvasElement, contextAttributes: WebGLContextAttributes) {
    super(canvas);
    this.context3D = canvas.getContext('webgl', contextAttributes);
  }
}