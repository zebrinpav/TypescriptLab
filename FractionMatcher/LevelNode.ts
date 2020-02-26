"use strict";
interface IView{
    moveToFront: Function,
    indexShape: number,
    height: number
}
interface IShape{
    view: IView|undefined,
    dropZone: number,
    numerator: number,
    denominator: number
}
interface IPosition{
    x: number,
    y: number
}
export function dropShapeToZone(shape: IShape, zoneIndex: number) {
    if (!shape.view)return;
    var model = {
        gameModel: {
            MINIMUM_PAIRS: 1,
            MAXIMUM_PAIRS: 10
        },
        dropZone: [1, 2]
    };
    //target dropZone now equals the indexShape
    model.dropZone[zoneIndex] = shape.view.indexShape;
    shape.dropZone = zoneIndex;
    let targetPosition: IPosition = {
        x: 100,
        y: 100
    };
    if (zoneIndex > model.gameModel.MAXIMUM_PAIRS * 2 - 1) {
        targetPosition.y -= shape.view.height / 2 - 13; //adjust position on scales
        //Adjust numeric mixed fractions down a bit because they are too high by default.
        if (shape.view && shape.numerator / shape.denominator > 1) {
            targetPosition.y += 11;
        }
        else if (shape.view) {
            targetPosition.y += 7;
        }
    }
    shape.view.moveToFront();
}
