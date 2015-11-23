//
//  RCTMGLAnnotationPolygon.h
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MGLPolygon.h"
#import "RCTMGLAnnotationProtocol.h"

@interface RCTMGLAnnotationPolygon : MGLPolygon <RCTMGLAnnotationProtocol>

@property (nonatomic) NSString *id;
@property (nonatomic) double fillAlpha;
@property (nonatomic) UIColor *fillColor;
@property (nonatomic) double strokeAlpha;
@property (nonatomic) UIColor *strokeColor;
@property (nonatomic) NSUInteger count;
@property (nonatomic) CLLocationCoordinate2D *coordinates;

+ (instancetype)polygonAnnotation:(CLLocationCoordinate2D *)coordinates
                            count:(NSUInteger)count
                        fillAlpha:(double)fillAlpha
                        fillColor:(UIColor *)fillColor
                      strokeColor:(UIColor *)strokeColor
                      strokeAlpha:(double)strokeAlpha
                               id:(NSString *)id;

@end

