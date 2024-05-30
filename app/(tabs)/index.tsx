import React, { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Place {
  id: number;
  photo: string | null;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Step {
  image: { uri: string };
  description: JSX.Element;
  name: string;
  descriptionText: string;
  category: string;
}

export default function HomeScreen() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNewsData = async () => {
    try {
      const response = await fetch(`https://dewalaravel.com/api/places`);
      const placesData = await response.json();
      
      const categoriesResponse = await fetch(`https://dewalaravel.com/api/categories`);
      const categoriesData = await categoriesResponse.json();

      setCategories(categoriesData.data);

      const formattedData = placesData.data.map((place: Place, index: number) => ({
        image: { uri: place.photo ? place.photo : 'https://via.placeholder.com/300' },
        description: <Text style={styles.boldText} key={index}>{place.name}</Text>,
        name: place.name,
        descriptionText: place.description,
        category: place.category.name,
      }));

      setSteps(formattedData);
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  const openModal = (step: Step) => {
    setSelectedStep(step);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStep(null);
  };

  const filterSteps = (step: Step) => {
    const matchesCategory = selectedCategory === null || step.category === categories.find(cat => cat.id === selectedCategory)?.name;
    const matchesSearch = !searchQuery || step.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  };

  const handleCategoryPress = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedView  style={styles.hello}>
          <ThemedText type="title">Hai, Rizalramzi!</ThemedText>
          <HelloWave></HelloWave>
        </ThemedView>
        <Text style={styles.paragraph}>Berita baru hari ini!</Text>
      </ThemedView>
      <View style={styles.breakingNewsContainer}>
        <Text style={styles.sectionTitle}>Breaking News</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
          <ScrollView horizontal style={styles.breakingNewsScroll}>
            {steps.slice(0, 3).map((step, index) => (
              <Image key={index} source={{ uri: step.image.uri }} style={styles.breakingNewsImage} />
            ))}
          </ScrollView>
        <ScrollView horizontal style={styles.categoryScroll}>
          <TouchableOpacity onPress={() => handleCategoryPress(null)}>
            <ThemedView style={selectedCategory === null ? styles.selectedCategoryButton : styles.categoryButton}>
              <ThemedText>Terbaru</ThemedText>
            </ThemedView>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} onPress={() => handleCategoryPress(category.id)}>
              <ThemedView style={selectedCategory === category.id ? styles.selectedCategoryButton : styles.categoryButton}>
                <ThemedText>{category.name}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <View style={styles.recommendationContainer}>
        <Text style={styles.sectionTitle}>Recommendation</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
        {steps.filter(filterSteps).map((step, index) => (
          <TouchableOpacity key={index} onPress={() => openModal(step)}>
            <ThemedView style={styles.stepContainer}>
              <Text style={styles.recommendationTitle}>{step.name}</Text>
              <Image source={{ uri: step.image.uri }} style={styles.recommendationImage} />
            </ThemedView>
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {selectedStep && (
              <>
                <ScrollView>
                  <Image source={selectedStep.image} style={styles.modalImage} />
                    <Text style={styles.modalText}>{selectedStep.name}</Text>
                  <ScrollView>
                    <Text style={styles.modalDescription}>{selectedStep.descriptionText}</Text>
                  </ScrollView>
                </ScrollView>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    padding: 16,
  },
  hello: {
    flexDirection: 'row',
  },
  paragraph: {
    color: 'white'
  },
  breakingNewsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white'
  },
  viewAllButton: {
    position: 'absolute',
    right: 16,
    top: 0,
  },
  viewAllText: {
    color: '#007BFF',
  },
  breakingNewsScroll: {
    marginBottom: 16,
  },
  breakingNewsImage: {
    width: 300,
    height: 200,
    borderRadius: 
    8,
    marginHorizontal: 5,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: '#252525',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedCategoryButton: {
    padding: 10,
    backgroundColor: '#1D3D47',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  recommendationContainer: {
    paddingHorizontal: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  recommendationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  recommendationImage: {
    width: 100,
    height: 100,
    marginLeft: 16,
    borderRadius: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  reactThumbnail: {
    height: 300,
    width: 300,
    position: 'relative',
  },
  boldText: {
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  modalDescription: {
    fontSize: 12,
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
});
