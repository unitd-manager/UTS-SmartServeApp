// Libraries import
import React from 'react';
import {Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

// Local import
import {getHeight, moderateScale} from '../../common/constants';
import strings from '../../i18n/strings';
import {commonColor, styles} from '../../themes';
import EButton from '../common/EButton';
import EText from '../common/EText';

const ProjectConfirmModal = props => {
  const colors = useSelector(state => state.theme.theme);

  const {
    visible,
    onPressModalClose,
    btnText1 = false,
    btnText2 = false,
    onPressBtn1,
    onPressBtn2,
    headerTitle,
  } = props;

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableOpacity
        style={localStyles.modalMainContainer}
        activeOpacity={1}
        onPress={onPressModalClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[localStyles.root, {backgroundColor:colors.inputBg}]}>
          <EText
            type={'b22'}
            color={colors.primary5}
            align={'center'}
            style={styles.mt25}>
            {!!headerTitle ?` ${headerTitle} `: strings.confirmationIn}
          </EText>
          {!!btnText1 && (
            <EButton
              title={btnText1}
              type={'S14'}
              containerStyle={localStyles.signBtnContainer}
              bgColor={colors.signBtn}
              onPress={onPressBtn1}
            />
          )}
          {!!btnText2 && (
            <EButton
              title={btnText2}
              type={'S14'}
              color={colors.primary5}
              bgColor={colors.dark3}
              containerStyle={localStyles.signBtnContainer}
              onPress={onPressBtn2}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.p30,
    ...styles.mh30,
    borderRadius: moderateScale(15),
  },
  modalMainContainer: {
    ...styles.flex,
    ...styles.center,
    backgroundColor: commonColor.modalBg,
  },
  signBtnContainer: {
    ...styles.mt20,
    height: getHeight(45),
    borderRadius: moderateScale(22),
    width: moderateScale(190),
    ...styles.selfCenter,
  },
});

export default ProjectConfirmModal;
