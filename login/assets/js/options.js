/**
 * AutoSave Form
 **/
function autoSaveForm() {
  // Log DataSaver events (before DataSaver start!)
  $(document).on('DataSaver_start DataSaver_stop DataSaver_save DataSaver_load DataSaver_remove', function(e) {});
  // Save data for fields with class 'save'
  $('#portal_settings_form .save, #vpn_settings_form .save').DataSaver({ events: 'change keyup' });
}

/**
 *  暗号化パスワード生成
 **/
function generateEncryptPassword(portal_or_vpn) {
  var pv = portal_or_vpn;
  $('#'+pv).attr('disabled','disabled');
  $('#'+pv).text('登録完了');
  pv = pv.replace('submit', '');
  chrome.runtime.getBackgroundPage(function(backgroundPage) {
    localStorage[pv + 'encryptPassword'] = backgroundPage.generate('enc', pv);
    localStorage.removeItem(pv + 'password');
    localStorage.removeItem(pv + 'confirmPassword');
  });
}

/**
 * フォームバリデーション
 **/
function validatorForm() {
  $('#portal_settings_form').bootstrapValidator({
    message: 'This value is not valid',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    submitHandler: function(validator, form, submitButton) {
      generateEncryptPassword(submitButton[0].id);
    },
    fields: {
      portal_student_id: {
        validators: {
          notEmpty: {
            message: 'The StudentId is required and can\'t be empty'
          },
          stringLength: {
            min: 7,
            max: 7,
            message: 'The StudentId must be 7 characters long'
          },
          regexp: {
            regexp: /^[0-9]+$/,
            message: 'The StudentId can only consist of number'
          }
        }
      },
      portal_password: {
        validators: {
          notEmpty: {
            message: 'The password is required and can\'t be empty'
          },
          identical: {
            field: 'portal_confirmPassword',
            message: 'The password and its confirm are not the same'
          }
        }
      },
      portal_confirmPassword: {
        validators: {
          notEmpty: {
            message: 'The confirm password is required and can\'t be empty'
          },
          identical: {
            field: 'portal_password',
            message: 'The password and its confirm are not the same'
          }
        }
      },
    }
  });

  $('#vpn_settings_form').bootstrapValidator({
    message: 'This value is not valid',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    submitHandler: function(validator, form, submitButton) {
      generateEncryptPassword(submitButton[0].id);
    },
    fields: {
      vpn_student_id: {
        validators: {
          notEmpty: {
            message: 'The StudentId is required and can\'t be empty'
          },
          stringLength: {
            min: 8,
            max: 8,
            message: 'The StudentId must be 8 characters long'
          },
          regexp: {
            regexp: /^a[0-9]+$/,
            message: 'The StudentId can only consist of \'a\' + number'
          }
        }
      },
      vpn_password: {
        validators: {
          notEmpty: {
            message: 'The password is required and can\'t be empty'
          },
          identical: {
            field: 'vpn_confirmPassword',
            message: 'The password and its confirm are not the same'
          }
        }
      },
      vpn_confirmPassword: {
        validators: {
          notEmpty: {
            message: 'The confirm password is required and can\'t be empty'
          },
          identical: {
            field: 'vpn_password',
            message: 'The password and its confirm are not the same'
          }
        }
      },
      vpn_mode: {
        validators: {
          notEmpty: {
            message: 'The gender is required'
          }
        }
      }
    }
  });
}

$(document).ready(function() {
  validatorForm();
  autoSaveForm();
  $.ionTabs("#settings");
});
