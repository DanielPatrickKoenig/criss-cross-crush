import * as PIXI from 'pixi.js';
const defaultProperties = {
    fill: 0x000000,
    stroke: 0x000000,
    fillOpacity: 1,
    strokeOpacity: 0,
    strokeWidth: 0,
    width: 72,
    height: 72,
    radius: 12,
    x: 0,
    y: 0,
    fontFamily: 'Arial',
    fontSize: 12,
    align: 'center'
};
function mapProperites(properties){
    let props = {};
    for(let p in defaultProperties){
        props[p] = properties[p] != undefined && properties[p] != null ? properties[p] : defaultProperties[p];
    }
    return props;
}
const PixiInstance = function (canvas, width, height, transparent) {
    const app = new PIXI.Application({
        view: canvas,
        width: width,
        height: height,
        transparent: transparent,
    });
    this.getApp = function () {
        return app;
    }
}
function PixiDraw () {

    this.bezierShape = function (path, properties, graphic) {
        let props = mapProperites(properties);
        let g = graphic ? graphic : new PIXI.Graphics();
        g.clear();
        g.beginFill(props.fill,props.fillOpacity);
        g.lineStyle(props.strokeWidth,props.stroke,props.strokeOpacity);
        g.moveTo(path[0][2].x, path[0][2].y);
        for(let i = 0; i < path.length; i++){
            const nextIndex = i == path.length - 1 ? 0 : i + 1;
            g.bezierCurveTo(path[i][0].x, path[i][0].y, path[nextIndex][1].x, path[nextIndex][1].y, path[nextIndex][2].x, path[nextIndex][2].y);
        }
        g.endFill();
        return g;
    }

    this.line = function (points,  properties, graphic) {
        let props = mapProperites(properties);
        let g = graphic ? graphic : new PIXI.Graphics();
        g.clear();
        g.lineStyle(props.strokeWidth,props.stroke,props.strokeOpacity);
        g.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            g.lineTo(points[i].x, points[i].y);
        }
        return g;
    }

    this.circle = function (properties, graphic) {
        let props = mapProperites(properties);
        // console.log(props);
        let g = graphic ? graphic : new PIXI.Graphics();
        g.clear();
        g.beginFill(props.fill,props.fillOpacity);
        g.lineStyle(props.strokeWidth,props.stroke,props.strokeOpacity);
        g.drawCircle(props.x, props.y, props.radius);
        g.endFill();
        return g;
    }
    this.rect = function (properties, graphic) {
        let props = mapProperites(properties);
        // console.log(props);
        let g = graphic ? graphic : new PIXI.Graphics();
        g.clear();
        g.beginFill(props.fill,props.fillOpacity);
        g.lineStyle(props.strokeWidth,props.stroke,props.strokeOpacity);
        g.drawRect(props.x, props.y, props.width, props.height);
        g.endFill();
        return g;
    }
    
}
function PixiImage(){
    this.image = function(src){
        return new PIXI.Sprite(PIXI.Texture.from(src));
    }
}
function PixiUtils(){
    this.sprite = function (texture) {
        return new PIXI.Sprite(texture);
    }
    this.graphic = function(){
        return PIXI.Graphics();
    }
    this.text = function(text, properties){
        let props = mapProperites(properties);
        return new PIXI.Text(text,{fontFamily : props.fontFamily, fontSize: props.fontSize, fill: props.fill, align: props.align, wordWrapWidth: props.width});
    }
}
function PixiAction(supressMobile){
    function setup (displayObject) {
        displayObject.interactive = true;
    }
    function processEvent (e) {
        return {x: e.data.global.x, y: e.data.global.y};
    }
    this.click = function(displayObject, handler) {
        setup(displayObject);
        displayObject.on('click', (e) => {
            if(handler){
                handler(processEvent(e), displayObject);
            }
        });
    }
    this.down = function (displayObject, handler){
        setup(displayObject);
        displayObject.on('mousedown', (e) => {
            if(handler){
                handler(processEvent(e), displayObject);
            }
        });
        if(!supressMobile){
            displayObject.on('touchstart', (e) => {
                // console.log(e);
                if(handler){
                    handler(processEvent(e), displayObject);
                }
            });
        }
    }
    this.move = function (displayObject, handler){
        setup(displayObject);
        displayObject.on('mousemove', (e) => {
            if(handler){
                handler(processEvent(e), displayObject);
            }
        });
        if(!supressMobile){
            displayObject.on('touchmove', (e) => {
                if(handler){
                    handler(processEvent(e), displayObject);
                }
            });
        }
    }
    this.up = function (displayObject, handler){
        setup(displayObject);
        displayObject.on('mouseup', (e) => {
            if(handler){
                handler(processEvent(e), displayObject);
            }
        });
        displayObject.on('mouseupoutside', (e) => {
            if(handler){
                handler(processEvent(e), displayObject);
            }
        });
        if(!supressMobile){
            displayObject.on('touchend', (e) => {
                if(handler){
                    handler(processEvent(e), displayObject);
                }
            });
            displayObject.on('touchendoutside', (e) => {
                if(handler){
                    handler(processEvent(e), displayObject);
                }
            });
        }
    }
}


export {PixiInstance, PixiDraw, PixiImage, PixiUtils, PixiAction};