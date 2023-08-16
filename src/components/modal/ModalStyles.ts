import styled from 'styled-components'
import { Modal } from 'antd'
import { breakpoints } from '@/styles/theme'

// eslint-disable-next-line import/prefer-default-export
export const NewModal = styled(Modal)<{ title?: any }>`
  &.custom-ant-modal-v5 {
    .ant-modal-content {
	  border-radius: 12px;
      background: ${({ theme }) => theme['color-base-surface-primary']};
      box-shadow: 0 44px 48px rgba(10, 22, 41, 0.08), 0 13.09px 15.09px rgba(10, 22, 41, 0.0521271), 0 6.51px 6.51px rgba(10, 22, 41, 0.04),
        0 2.71728px 2.71728px rgba(10, 22, 41, 0.0278729);
      padding: 0;
	  }

    .ant-modal-close {
      position: absolute;
      top: 12px !important;
      right: 12px !important;
      border-radius: 50%;
      background: ${({ theme }) => theme['color-base-surface-quaternary']};
      width: 48px;
      height: 48px;

      .ant-modal-close-x {
        display: flex;
		color: white;
		font-weight: 700;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
    }

    .ant-modal-header {
      border: none;
      border-top-left-radius: 24px;
      border-top-right-radius: 24px;
      background: ${({ theme }) => theme['color-base-surface-primary']};
      padding: 28px 32px;

      h5 {
        margin: 0;
        letter-spacing: -0.022em;
        font-weight: 500;
        font-size: 32px;
        line-height: 132%;
        color: ${({ theme }) => theme['color-base-content-top']};
      }
    }

    .ant-modal-body {
      padding: 32px;
      p {
        margin: 0;
        line-height: 24px;
        letter-spacing: -0.015em;
        font-size: 16px;
        color: ${({ theme }) => theme['color-base-content-top']};
      }
	  @media (max-width: ${breakpoints.md}px) {
		padding: 16px;
	  }
    }

    .ant-modal-footer {
      display: flex;
      flex-direction: row;
      justify-content: end;
      gap: 6px;
      border: 0;
      padding: 24px 32px;

      button {
        padding: 8px 16px;
      }
  }

`
