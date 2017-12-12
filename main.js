/*eslint-env node, es6*/
/* Unpublish all module items that are lesson notes in canvas */

const async = require('async'),
    canvas = require('canvas-wrapper');

module.exports = (course, stepCallback) => {
    var courseId = course.info.canvasOU,
        moduleUrl = 'api/v1/courses/' + courseId + 'modules/';
    course.addModuleReport('unpublish-lesson-notes');

    function getAllModules(moduleUrl) {
        var allModules = canvas.get(moduleUrl, function (err, modules) {
            if (err) {
                console.log('ERROR', err);
                return;
            }
            return modules;
        });
        return allModules;
        course.success('unpublish-lesson-notes', 'successfully retrieved modules')
    }

    /*not entirely sure how to make this use allModules...*/
    function getModuleItems(allModules) {
        var moduleId = module.id,
            moduleItemUrl = 'api/v1/courses/' + courseId + 'modules/' + moduleId + '/items?search_term=lesson%20notes',
            lessonNotes = canvas.get(moduleItemUrl, function (err, items) {
                if (err) {
                    console.log('ERROR', err);
                    return;
                }
                return items;
            })
        return lessonNotes;
        course.success('unpublish-lesson-notes', 'successfully retrieved module items')
    }


    function changeLessonNotes(lessonNotes, moduleId) {
        var unpublish = {
                module_item[published]: false
            },
            unpublishedPages = lessonNotes.forEach(function (file) {
                //I've never used put before..?
                canvas.put(moduleItemUrl, unpublish, function (err, body) {
                    var fileId = file.id,
                        itemId = 'api/v1/courses/' + courseId + 'modules/' + moduleId + '/items/' + fileId;
                    if (err) {
                        console.log('ERROR', err)
                        return;
                    }
                    return body;
                })
            });
        course.success('unpublish-lesson-notes', 'successfully unpublished Lesson Notes')
        return unpublishedPages;
    }

    async.waterfall([getAllModules, getModuleItems, changeLessonNotes], function (err, result) {
        if (err) {
            course.throwErr('unpublish-lesson-notes', err)
        }
    })
    stepCallback(null, course);
};
