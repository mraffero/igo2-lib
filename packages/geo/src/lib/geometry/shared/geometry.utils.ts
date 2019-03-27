import * as olstyle from 'ol/style';
import OlLineString from 'ol/geom/LineString';
import OlPolygon from 'ol/geom/Polygon';
import OlGeoJSON from 'ol/format/GeoJSON';
import lineIntersect from '@turf/line-intersect';
import { lineString } from '@turf/helpers';

import {
  GeometrySliceMultiPolygonError,
  GeometrySliceLineStringError,
  GeometrySliceTooManyIntersectionError
 } from './geometry.errors';

/**
 * Create a default style for draw and modify interactions
 * @returns OL style
 */
export function createDrawInteractionStyle(): olstyle.Style {
  return new olstyle.Style({
    stroke: new olstyle.Stroke({
      color:  [0, 153, 255, 1],
      width: 2
    }),
    fill:  new olstyle.Fill({
      color:  [0, 153, 255, 0.2]
    }),
    image: new olstyle.Circle({
      radius: 5,
      stroke: new olstyle.Stroke({
        color: [0, 153, 255, 1],
      }),
      fill: new olstyle.Fill({
        color:  [0, 153, 255, 0.2]
      })
    })
  });
}

/**
 * Splice geometry into two parts
 * @param olGeometry OL geometry
 * @param olSlicer Slicing line
 * @returns New OL geometries
 */
export function sliceOlGeometry(
  olGeometry: OlLineString | OlPolygon,
  olSlicer: OlLineString
): Array<OlLineString | OlPolygon> {
  if (olGeometry instanceof OlPolygon) {
    return sliceOlPolygon(olGeometry, olSlicer);
  } else if (olGeometry instanceof OlLineString) {
    return sliceOlLineString(olGeometry, olSlicer);
  }
  return [];
}

/**
 * Slice OL LineString into one or more lines
 * @param olLineString OL line string
 * @param olSlicer Slicing line
 * @returns New OL line strings
 */
export function sliceOlLineString(olLineString: OlLineString, olSlicer: OlLineString): OlLineString[] {
  return [];
}

/**
 * Slice OL Polygon into one or more polygons
 * @param olPolygon OL polygon
 * @param olSlicer Slicing line
 * @returns New OL polygons
 */
export function sliceOlPolygon(olPolygon: OlPolygon, olSlicer: OlLineString): OlPolygon[] {
  if (olPolygon.getLinearRingCount() > 1) {
    throw new GeometrySliceMultiPolygonError();
  }

  if (olSlicer.getCoordinates().length > 2) {
    throw new GeometrySliceLineStringError();
  }

  const olGeoJSON = new OlGeoJSON();
  const slicer = olGeoJSON.writeGeometryObject(olSlicer);
  const outerCoordinates = olPolygon.getLinearRing(0).getCoordinates();

  const parts = [[], []];
  let totalIntersectionCount = 0;
  for (let i = 0, ii = outerCoordinates.length - 1; i < ii; i++) {
    const segmentCoordinates = [outerCoordinates[i], outerCoordinates[i + 1]];
    const segment = lineString(segmentCoordinates);
    const intersections = lineIntersect(segment, slicer).features;

    const intersectionCount = intersections.length;
    totalIntersectionCount += intersectionCount;
    if (intersectionCount > 1 || totalIntersectionCount > 2) {
      throw new GeometrySliceTooManyIntersectionError();
    }

    parts[0].push(segmentCoordinates[0]);
    if (intersectionCount === 1) {
      const intersection = intersections[0].geometry.coordinates;
      parts[0].push(intersection);
      parts[1].push(intersection);
      parts.reverse();
    }
  }

  if (totalIntersectionCount <= 1) {
    return [];
  }

  parts[0].push(parts[0][0]);
  parts[1].push(parts[1][0]);

  return [new OlPolygon([parts[0]]), new OlPolygon([parts[1]])];
}