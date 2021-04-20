import { useState, useEffect, useCallback } from 'react';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

var generateReturnPayload = function generateReturnPayload(names, values, warnings, onChangeHandlers) {
  if (names === void 0) {
    names = [];
  }

  if (values === void 0) {
    values = [];
  }

  if (warnings === void 0) {
    warnings = [];
  }

  if (onChangeHandlers === void 0) {
    onChangeHandlers = [];
  }

  var payload = {};

  if (names.length === values.length && values.length === warnings.length && warnings.length === onChangeHandlers.length) {
    names.forEach(function (name, i) {
      payload[camelize(name)] = values[i];
      payload[camelize("on " + name + " Change")] = onChangeHandlers[i];
      payload[camelize("show " + name + " Warning")] = warnings[i];
    });
  } else {
    names.forEach(function (name) {
      payload[camelize(name)] = '';

      payload[camelize("on " + name + " Change")] = function () {};

      payload[camelize("show " + name + " Warning")] = false;
    });
  }

  return payload;
};

var useFormState = function useFormState(_ref) {
  var states = _ref.states,
      debug = _ref.debug;

  var _useState = useState(states.map(function (state) {
    return state.name;
  })),
      names = _useState[0];

  var _useState2 = useState(states.map(function (state) {
    return state["default"];
  })),
      values = _useState2[0],
      setValues = _useState2[1];

  var _useState3 = useState(states.map(function (state) {
    return state.mustBeValid;
  })),
      mandatory = _useState3[0];

  var _useState4 = useState(states.map(function (state) {
    return state.validator;
  })),
      validators = _useState4[0];

  var _useState5 = useState(states.map(function (state) {
    return state.isValid;
  })),
      valids = _useState5[0],
      setValids = _useState5[1];

  var _useState6 = useState(states.map(function () {
    return false;
  })),
      needValidations = _useState6[0],
      setNeedValidations = _useState6[1];

  var _useState7 = useState(states.map(function () {
    return false;
  })),
      edits = _useState7[0],
      setEdits = _useState7[1];

  var _useState8 = useState(states.map(function () {
    return false;
  })),
      warnings = _useState8[0],
      setWarnings = _useState8[1];

  var _useState9 = useState(false),
      isValid = _useState9[0],
      setIsValid = _useState9[1];

  var _useState10 = useState(false),
      isValidating = _useState10[0],
      setIsValidating = _useState10[1];

  useEffect(function () {
    setIsValidating(function () {
      var v = false;
      needValidations.forEach(function (val) {
        if (val) v = true;
      });
      return v;
    });
  }, [needValidations]);
  var validate = useCallback(function () {
    needValidations.forEach(function (needsValidation, index) {
      if (needsValidation) {
        setValids(function (prev) {
          var arr = [].concat(prev);
          arr[index] = validators[index](values[index]);
          return arr;
        });
        setNeedValidations(function (prev) {
          var arr = [].concat(prev);
          arr[index] = false;
          return arr;
        });
      }
    });
  }, [needValidations, validators, values]);
  useEffect(function () {
    return validate();
  }, [validate]);
  var triggerWarnings = useCallback(function () {
    mandatory.forEach(function (isMandatory, index) {
      if (isMandatory) {
        setWarnings(function (prev) {
          var arr = [].concat(prev);
          arr[index] = !needValidations[index] && !valids[index] && edits[index];
          return arr;
        });
      }
    });
  }, [valids, needValidations, edits, mandatory]);
  useEffect(function () {
    return triggerWarnings();
  }, [triggerWarnings]);
  useEffect(function () {
    if (!isValidating) setIsValid(function () {
      var answer = true;
      mandatory.forEach(function (isMandatory, index) {
        if (isMandatory) if (!valids[index]) answer = false;
      });
      return answer;
    });
  }, [valids, mandatory, isValidating]);
  var onChangeHandler = useCallback(function (index, value) {
    setValues(function (prev) {
      var arr = [].concat(prev);
      arr[index] = value;
      return arr;
    });
    setNeedValidations(function (prev) {
      var arr = [].concat(prev);
      arr[index] = true;
      return arr;
    });
    setEdits(function (prev) {
      var arr = [].concat(prev);
      arr[index] = true;
      return arr;
    });
  }, []);
  var triggerValidation = useCallback(function () {
    setEdits(function (prev) {
      var arr = [].concat(prev);
      arr.fill(true);
      return arr;
    });
    setNeedValidations(function (prev) {
      var arr = [].concat(prev);
      arr.fill(true);
      return arr;
    });
  }, []);
  var reset = useCallback(function () {
    setValues(states.map(function (state) {
      return state["default"];
    }));
    setValids(states.map(function (state) {
      return state.isValid;
    }));
    setNeedValidations(states.map(function () {
      return false;
    }));
    setIsValid(false);
  }, [states]);
  var resetState = useCallback(function (index) {
    setValues(function (prev) {
      var arr = [].concat(prev);
      arr[index] = states[index]["default"];
      return arr;
    });
    setValids(function (prev) {
      var arr = [].concat(prev);
      arr[index] = states[index].defaultIsValid;
      return arr;
    });
    setNeedValidations(function (prev) {
      var arr = [].concat(prev);
      arr[index] = false;
      return arr;
    });
  }, [states]);
  var setState = useCallback(function (index, value, isValid, needsValidation) {
    setValues(function (prev) {
      var arr = [].concat(prev);
      arr[index] = value;
      return arr;
    });
    setValids(function (prev) {
      var arr = [].concat(prev);
      arr[index] = isValid;
      return arr;
    });
    setNeedValidations(function (prev) {
      var arr = [].concat(prev);
      arr[index] = needsValidation;
      return arr;
    });
  }, []);

  var _useState11 = useState(states.map(function (state, index) {
    return function (value) {
      return onChangeHandler(index, value);
    };
  })),
      onChangeHandlers = _useState11[0];

  var _useState12 = useState(states.map(function (state, index) {
    return function () {
      return resetState(index);
    };
  })),
      resetStates = _useState12[0];

  var _useState13 = useState(states.map(function (state, index) {
    return function (value, isValid, needsValidation) {
      return setState(index, value, isValid, needsValidation);
    };
  })),
      setStates = _useState13[0];

  useEffect(function () {
    if (debug) console.log('form state: names: ', names);
  }, [debug, names]);
  useEffect(function () {
    if (debug) console.log('form state: values: ', values);
  }, [debug, values]);
  useEffect(function () {
    if (debug) console.log('form state: edits: ', edits);
  }, [debug, edits]);
  useEffect(function () {
    if (debug) console.log('form state: needValidations: ', needValidations);
  }, [debug, needValidations]);
  useEffect(function () {
    if (debug) console.log('form state: valids: ', valids);
  }, [debug, valids]);
  useEffect(function () {
    if (debug) console.log('form state: validators: ', validators);
  }, [debug, validators]);
  useEffect(function () {
    if (debug) console.log('form state: mandatory: ', mandatory);
  }, [debug, mandatory]);
  useEffect(function () {
    if (debug) console.log('form state: warnings: ', warnings);
  }, [debug, warnings]);
  useEffect(function () {
    if (debug) console.log('form state: isValidating: ', isValidating);
  }, [debug, isValidating]);
  useEffect(function () {
    if (debug) console.log('form state: isValid: ', isValid);
  }, [debug, isValid]);
  useEffect(function () {
    if (debug) console.log('form state: onChangeHandlers: ', onChangeHandlers);
  }, [debug, onChangeHandlers]);

  var _useState14 = useState(generateReturnPayload(names, values, warnings, onChangeHandlers)),
      payload = _useState14[0],
      setPayload = _useState14[1];

  useEffect(function () {
    setPayload(generateReturnPayload(names, values, warnings, onChangeHandlers));
  }, [names, values, warnings, onChangeHandlers]);
  return _extends({
    isValid: isValid,
    isValidating: isValidating,
    triggerWarnings: triggerWarnings,
    triggerValidation: triggerValidation,
    reset: reset,
    resetStates: resetStates,
    setStates: setStates
  }, payload);
};

export default useFormState;
//# sourceMappingURL=index.modern.js.map
