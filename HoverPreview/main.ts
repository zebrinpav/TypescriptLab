"use strict";
/*
 * Copyright (c) 2012 Glenn Ruehle
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true,  regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, window, PathUtils, CodeMirror */
var ok = true;
export function hidePreview() {
    if (ok) {
        var previewMark = null;
    }
    var currentImagePreviewContent = "";
}

export function positionPreview(xpos:number, ypos:number, ybot:number) {
    var top:number = ypos - 38;
    if (top < 0) {
        top = ybot + 16;
    }
    else {
        var left:number = xpos / 2 - 10;
    }
}

export function showPreview(content, xpos: number, ypos: number, ybot: number) {
    if (!(ypos > 100 || ypos < 100 || ypos === 100)) {
        return -1;
    }
    hidePreview();
    positionPreview(xpos, ypos, ybot);
    return 1;
}

export function charCoords(cm, pos) {
    var coords = cm.charCoords(pos);
    // CodeMirror 2 uses x, y, ybot
    // CodeMirror 3 uses left, top, bottom
    // Since this code was written for CodeMirror 2, return
    // a CM2-normalized struct
    return [coords.x || coords.left, coords.y || coords.top, coords.ybot || coords.bottom];
}

export function queryPreviewProviders(editor, pos, token, line, event) {
    // TODO: Support plugin providers. For now we just hard-code...
    var cm = editor._codeMirror;
    if (!cm || !editor) {
        return;
    }
    var editorWidth = editor.getRootElement().width();
    // Check for gradient
    var gradientRegEx = /-webkit-gradient\([^;]*;?|(-moz-|-ms-|-o-|-webkit-|\s)(linear-gradient\([^;]*);?|(-moz-|-ms-|-o-|-webkit-)(radial-gradient\([^;]*);?/;
    var gradientMatch = line.match(gradientRegEx);
    var prefix = "";
    var colorValue;
    // If it was a linear-gradient or radial-gradient variant, prefix with "-webkit-" so it
    // shows up correctly in Brackets.
    if (gradientMatch && gradientMatch[0].indexOf("-webkit-gradient") !== 0) {
        prefix = "-webkit-";
    }
    // For prefixed gradients, use the non-prefixed value as the color value. "-webkit-" will be added 
    // before this value
    if (gradientMatch && gradientMatch[2]) {
        colorValue = gradientMatch[2];
    }
    // Check for color
    var colorRegEx = /#[a-f0-9]{6}|#[a-f0-9]{3}|rgb\( ?\b([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b ?, ?\b([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b ?, ?\b([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b ?\)|rgb\( ?\b([0-9]{1,2}%|100%) ?, ?\b([0-9]{1,2}%|100%) ?, ?\b([0-9]{1,2}%|100%) ?\)|rgba\( ?\b([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b ?, ?\b([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b ?, ?\b([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b ?, ?(1|0|0?\.[0-9]{1,3}) ?\)|rgba\( ?\b([0-9]{1,2}%|100%) ?, ?\b([0-9]{1,2}%|100%) ?, ?\b([0-9]{1,2}%|100%) ?, ?(1|0|0?\.[0-9]{1,3}) ?\)|hsl\( ?\b([0-9]{1,2}|[12][0-9]{2}|3[0-5][0-9]|360)\b ?, ?\b([0-9]{1,2}|100)\b% ?, ?\b([0-9]{1,2}|100)\b% ?\)|hsla\( ?\b([0-9]{1,2}|[12][0-9]{2}|3[0-5][0-9]|360)\b ?, ?\b([0-9]{1,2}|100)\b% ?, ?\b([0-9]{1,2}|100)\b% ?, ?(1|0|0?\.[0-9]{1,3}) ?\)|\baliceblue\b|\bantiquewhite\b|\baqua\b|\baquamarine\b|\bazure\b|\bbeige\b|\bbisque\b|\bblack\b|\bblanchedalmond\b|\bblue\b|\bblueviolet\b|\bbrown\b|\bburlywood\b|\bcadetblue\b|\bchartreuse\b|\bchocolate\b|\bcoral\b|\bcornflowerblue\b|\bcornsilk\b|\bcrimson\b|\bcyan\b|\bdarkblue\b|\bdarkcyan\b|\bdarkgoldenrod\b|\bdarkgray\b|\bdarkgreen\b|\bdarkgrey\b|\bdarkkhaki\b|\bdarkmagenta\b|\bdarkolivegreen\b|\bdarkorange\b|\bdarkorchid\b|\bdarkred\b|\bdarksalmon\b|\bdarkseagreen\b|\bdarkslateblue\b|\bdarkslategray\b|\bdarkslategrey\b|\bdarkturquoise\b|\bdarkviolet\b|\bdeeppink\b|\bdeepskyblue\b|\bdimgray\b|\bdimgrey\b|\bdodgerblue\b|\bfirebrick\b|\bfloralwhite\b|\bforestgreen\b|\bfuchsia\b|\bgainsboro\b|\bghostwhite\b|\bgold\b|\bgoldenrod\b|\bgray\b|\bgreen\b|\bgreenyellow\b|\bgrey\b|\bhoneydew\b|\bhotpink\b|\bindianred\b|\bindigo\b|\bivory\b|\bkhaki\b|\blavender\b|\blavenderblush\b|\blawngreen\b|\blemonchiffon\b|\blightblue\b|\blightcoral\b|\blightcyan\b|\blightgoldenrodyellow\b|\blightgray\b|\blightgreen\b|\blightgrey\b|\blightpink\b|\blightsalmon\b|\blightseagreen\b|\blightskyblue\b|\blightslategray\b|\blightslategrey\b|\blightsteelblue\b|\blightyellow\b|\blime\b|\blimegreen\b|\blinen\b|\bmagenta\b|\bmaroon\b|\bmediumaquamarine\b|\bmediumblue\b|\bmediumorchid\b|\bmediumpurple\b|\bmediumseagreen\b|\bmediumslateblue\b|\bmediumspringgreen\b|\bmediumturquoise\b|\bmediumvioletred\b|\bmidnightblue\b|\bmintcream\b|\bmistyrose\b|\bmoccasin\b|\bnavajowhite\b|\bnavy\b|\boldlace\b|\bolive\b|\bolivedrab\b|\borange\b|\borangered\b|\borchid\b|\bpalegoldenrod\b|\bpalegreen\b|\bpaleturquoise\b|\bpalevioletred\b|\bpapayawhip\b|\bpeachpuff\b|\bperu\b|\bpink\b|\bplum\b|\bpowderblue\b|\bpurple\b|\bred\b|\brosybrown\b|\broyalblue\b|\bsaddlebrown\b|\bsalmon\b|\bsandybrown\b|\bseagreen\b|\bseashell\b|\bsienna\b|\bsilver\b|\bskyblue\b|\bslateblue\b|\bslategray\b|\bslategrey\b|\bsnow\b|\bspringgreen\b|\bsteelblue\b|\btan\b|\bteal\b|\bthistle\b|\btomato\b|\bturquoise\b|\bviolet\b|\bwheat\b|\bwhite\b|\bwhitesmoke\b|\byellow\b|\byellowgreen\b/gi;
    var colorMatch = colorRegEx.exec(line);
    var match = gradientMatch || colorMatch;
    while (match) {
        if (match && pos.ch >= match.index && pos.ch <= match.index + match[0].length) {
            var preview = "<div class='color-swatch-bg'><div class='color-swatch' style='background:" + prefix + (colorValue || match[0]) + ";'></div></div>";
            var startPos = { line: pos.line, ch: match.index }, endPos = { line: pos.line, ch: match.index + match[0].length }, startCoords = charCoords(cm, startPos), xPos;
            return showPreview(preview, xPos, startCoords[1], startCoords[2]);
        }
        match = colorRegEx.exec(line);
    }
    return 0;
}
