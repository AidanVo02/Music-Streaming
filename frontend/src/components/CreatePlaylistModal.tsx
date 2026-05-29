import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, StyleSheet, Dimensions, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ORANGE = '#ff8000';

interface CreatePlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string) => Promise<void>;
}

export default function CreatePlaylistModal({ visible, onClose, onCreate }: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await onCreate(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to create playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>NEW PLAYLIST</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={28} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NAME *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter playlist name"
                placeholderTextColor="#555"
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>DESCRIPTION (OPTIONAL)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a description"
                placeholderTextColor="#555"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.createButton, (!name.trim() || loading) && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={!name.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.createButtonText}>CREATE</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#1a1a1a',
    borderRadius: width * 0.04,
    padding: width * 0.05,
    gap: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  form: {
    gap: width * 0.04,
  },
  inputGroup: {
    gap: width * 0.02,
  },
  label: {
    fontSize: width * 0.03,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#0d0d0d',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.035,
    fontSize: width * 0.04,
    color: '#fff',
    fontWeight: '600',
  },
  textArea: {
    height: width * 0.25,
    textAlignVertical: 'top',
    paddingTop: width * 0.035,
  },
  actions: {
    flexDirection: 'row',
    gap: width * 0.03,
  },
  button: {
    flex: 1,
    paddingVertical: width * 0.04,
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#0d0d0d',
    borderWidth: 1,
    borderColor: '#333',
  },
  cancelButtonText: {
    fontSize: width * 0.035,
    fontWeight: '800',
    color: '#aaa',
    letterSpacing: 1,
  },
  createButton: {
    backgroundColor: ORANGE,
  },
  createButtonText: {
    fontSize: width * 0.035,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
