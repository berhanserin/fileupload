import axios from 'axios';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
    };
  }
  uploadPhoto = async response => {
    const data = new FormData();
    response.assets.forEach(filed => {
      data.append('photos', {
        uri: filed.uri,
        name: filed.fileName,
        type: filed.type,
      });
    });

    await axios({
      method: 'post',
      url: 'http://192.168.1.40:5000/upload',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(response => {
        console.log(response);
      })
      .catch(hata => {
        console.log(hata);
      });
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <Text style={{color: '#000000'}}>Merhaba</Text>
        <View style={{width: 100, marginLeft: 15}}>
          <TouchableOpacity
            style={{backgroundColor: '#14CC4E', marginBottom: 20}}
            onPress={() => {
              launchImageLibrary(
                {
                  title: 'Resim Seç',
                  selectionLimit: 150,
                  customButtons: [
                    {
                      name: 'customOptionKey',
                      title: 'Choose Photo from Custom Option',
                    },
                  ],
                },
                response => {
                  let file = [];
                  this.uploadPhoto(response);
                  response.assets.map(data => {
                    file.push({uri: data.uri});
                  });
                  this.setState({files: file});
                },
              );
            }}>
            <Text style={{color: '#000000'}}>Galery</Text>
          </TouchableOpacity>
          {this.state.files ? (
            this.state.files.map(response => {
              return (
                <Image
                  key={response.uri}
                  source={response}
                  style={{width: 200, height: 200, marginBottom: 15}}
                />
              );
            })
          ) : (
            <Text>İmage</Text>
          )}
        </View>
      </View>
    );
  }
}
