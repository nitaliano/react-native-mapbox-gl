//
//  RCTMapboxGL.m
//  RCTMapboxGL
//
//  Created by Bobby Sudekum on 4/30/15.
//  Copyright (c) 2015 Mapbox. All rights reserved.
//

#import "RCTMapboxGL.h"
#import "RCTLog.h"

@implementation RCTMapboxGL

- (instancetype)init
{
    if (self = [super initWithFrame:CGRectMake(0, 0, 300, 300)]) {
        // init logic
    }
    return self;
}

#pragma mark Accessors

- (void)setAccessToken:(NSString *)accessToken
{
    [MGLAccountManager setAccessToken:accessToken];
}

- (void)setAttributionButtonVisibility:(BOOL)isVisible
{
    self.attributionButton.layer.opacity = isVisible ? 1 : 0;
}

@end