//
//  RCTMGLAnnotationPolyline.m
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import "RCTMGLAnnotationPolyline.h"

@implementation RCTMGLAnnotationPolyline

+ (instancetype)polylineWithCoordinates:(CLLocationCoordinate2D *)coordinates
                           count:(NSUInteger)count
                     strokeAlpha:(double)strokeAlpha
                     strokeColor:(UIColor *)strokeColor
                     strokeWidth:(double)strokeWidth
                              id:(NSString *)id

{
    RCTMGLAnnotationPolyline *polyline = [self polylineWithCoordinates:coordinates count:count];
    
    polyline.strokeAlpha = strokeAlpha;
    polyline.strokeColor = strokeColor;
    polyline.strokeWidth = strokeWidth;
    polyline.id = id;
    
    return polyline;
}
@end

