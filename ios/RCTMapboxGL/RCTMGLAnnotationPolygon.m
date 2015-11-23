//
//  RCTMGLAnnotationPolygon.m
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import "RCTMGLAnnotationPolygon.h"

@implementation RCTMGLAnnotationPolygon

+ (instancetype)polygonAnnotation:(CLLocationCoordinate2D *)coordinates
                            count:(NSUInteger)count
                        fillAlpha:(double)fillAlpha
                        fillColor:(UIColor *)fillColor
                      strokeColor:(UIColor *)strokeColor
                      strokeAlpha:(double)strokeAlpha
                               id:(NSString *)id
{
    RCTMGLAnnotationPolygon *polygon = [self polygonWithCoordinates:coordinates count:count];
    
    polygon.fillAlpha = fillAlpha;
    polygon.fillColor = fillColor;
    polygon.strokeAlpha = strokeAlpha;
    polygon.strokeColor = strokeColor;
    polygon.id = id;
    
    return polygon;
}

@end
