export function AEMTrack(msg: string) {
  const w = <any>window;
  if (w && w._satellite &&  w._satellite.track && typeof w._satellite.track === 'function' ) {
    w._satellite.track(msg);
  }
}

export function AEMSet(propPath: string, value: any): void {
  const propPathParts = propPath.split('.');
  if (propPathParts[0].toLowerCase() === 'window') {
    propPathParts.shift();
  }
  propPathParts.reduce((currProp, pathPart, currIdx) => {
    if (currIdx === (propPathParts.length - 1)) {
      // last, set the val
      currProp[pathPart] = value;
    } else {
      if (!currProp[pathPart]) {
        currProp[pathPart] = {};
      }
      return currProp[pathPart];
    }
  }, window);
}


/* Code added for clearing the evars from the digital data object */

export function AEMClearVars():void{

const w = <any>window;

if (w) {


  var s = w._satellite.getToolsByType('sc')[0].getS()
  
  s.clearVars;
}
}
