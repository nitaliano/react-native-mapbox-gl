//
//  RCTMGLAnnotation.m
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import "RCTMGLAnnotation.h"

@interface RCTMGLAnnotation ()

@property (nonatomic) CLLocationCoordinate2D coordinate;
@property (nonatomic) NSString *title;
@property (nonatomic) NSString *subtitle;

@end

@implementation RCTMGLAnnotation

+ (instancetype)annotationWithLocation:(CLLocationCoordinate2D)coordinate
                                 title:(NSString *)title
                              subtitle:(NSString *)subtitle
                                    id:(NSString *)id
{
    return [[self alloc] initWithLocation:coordinate
                                    title:title
                                 subtitle:subtitle
                                       id:id];
}

- (instancetype)initWithLocation:(CLLocationCoordinate2D)coordinate
                           title:(NSString *)title
                        subtitle:(NSString *)subtitle
                              id:(NSString *)id
{
    if (self = [super init]) {
        _coordinate = coordinate;
        _title = title;
        _subtitle = subtitle;
        _id = id;
    }

    return self;
}

@end

